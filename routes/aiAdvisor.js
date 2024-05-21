const express = require('express');
const router = express.Router();
const OpenAI = require("openai");
const constants = require('../constants.json');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const fs = require('fs');
const path = require('path');
const ChatHistory = require('../models/chatHistory');

router.get('/history', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const chatHistories = await ChatHistory.find({ userId: req.session.userId });
    res.render('aiLog', { chatHistories, path: '/AI' });
});

router.get('/AI', (req, res) => {
    res.render('aiAdvisor', { username: req.session.username, path: req.path });
});

router.post('/advisor', async function (req, res) {
    let { userMessages, assistantMessages } = req.body;

    let messages = [
        { role: "system", content: constants.SYSTEM_COMMENT }
    ];

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push({
                role: "user",
                content: String(userMessages.shift()).replace(/\n/g, "")
            });
        }
        if (assistantMessages.length != 0) {
            messages.push({
                role: "assistant",
                content: String(assistantMessages.shift()).replace(/\n/g, "")
            });
        }
    }

    const maxRetries = 3;
    let retries = 0;
    let completion;
    while (retries < maxRetries) {
        try {
            completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: messages
            });
            break;
        } catch (error) {
            retries++;
            console.log(error);
            console.log(`Error fetching data, retrying (${retries}/${maxRetries})...`);
        }
    }

    let chatGPTResult = completion.choices[0].message.content;
    console.log(`Question: ${messages.at(-2).content}\nAnswer: ${chatGPTResult}`);

    let question = messages.at(-2).content;
    let answer = chatGPTResult;

    if (!req.session.chatHistory) {
        req.session.chatHistory = [];
    }
    req.session.chatHistory.push({ question, answer });

    res.json({ assistant: chatGPTResult });
});

router.post('/saveConversation', async (req, res) => {
    console.log('Save conversation route hit');
    if (req.session.chatHistory) {
        try {
            const chatHistory = new ChatHistory({
                userId: req.session.userId,
                chatHistory: req.session.chatHistory
            });
            const result = await chatHistory.save();
            console.log('Conversation saved successfully:', result);
            res.sendStatus(200);
        } catch (error) {
            console.error('Error saving conversation:', error);
            res.sendStatus(500);
        }
    } else {
        console.log('No chat history to save.');
        res.sendStatus(400);
    }
});

router.post('/saveChat/:id', async (req, res) => {
    const chatId = req.params.id;
    const chat = await ChatHistory.findById(chatId);

    if (chat && chat.userId.equals(req.session.userId)) {
        const filePath = path.join(__dirname, `../public/chat_${chatId}.txt`);
        const fileContent = chat.chatHistory.map(item => `User: ${item.question}\nAI: ${item.answer}`).join('\n\n');

        fs.writeFile(filePath, fileContent, (err) => {
            if (err) {
                return res.status(500).send('Error saving file');
            }
            res.download(filePath, () => {
                fs.unlinkSync(filePath);
            });
        });
    } else {
        res.status(403).send('Forbidden');
    }
});

router.post('/deleteChat/:id', async (req, res) => {
    const chatId = req.params.id;
    const result = await ChatHistory.deleteOne({ _id: chatId, userId: req.session.userId });

    if (result.deletedCount > 0) {
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
});

module.exports = router;
