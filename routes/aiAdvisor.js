const express = require('express');
const router = express.Router();
const OpenAI = require("openai");
const constants = require('../constants.json');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const fs = require('fs');
const path = require('path');
const ChatHistory = require('../models/chatHistory');
const { getUserGroups, getUserTransactions, getUserDetails } = require('../controllers/dataFetcherController');

/**
 * Route for rendering the chat history page
 * @name get/history
 * @function
 * @memberof module:routers/ai
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/history', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const chatHistories = await ChatHistory.find({ userId: req.session.userId });
    res.render('aiLog', { chatHistories, path: '/AI' });
});

/**
 * Route for rendering the AI advisor page
 * @name get/AI
 * @function
 * @memberof module:routers/ai
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/AI', (req, res) => {
    res.render('aiAdvisor', { username: req.session.username, path: req.path });
});

/**
 * Route for handling AI advisor requests
 * @name post/advisor
 * @function
 * @memberof module:routers/ai
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/advisor', async function (req, res) {
    let { userMessages, assistantMessages } = req.body;

    let messages = [
        { role: "system", content: constants.SYSTEM_COMMENT }
    ];

    const userId = req.session.userId;

    const [userGroups, userTransactions, userDetails] = await Promise.all([
        getUserGroups(userId),
        getUserTransactions(userId),
        getUserDetails(userId)
    ]);

    const userContext = `
    User Details:
    - Username: ${userDetails.username}
    - Email: ${userDetails.email}
    - Phone: ${userDetails.phone}

    Groups:
    ${userGroups.map(group => `- ${group.group_name}`).join('\n')}

    Transactions:
    ${userTransactions.map(transaction => `- ${transaction.name}: $${transaction.total_cost}`).join('\n')}
    `;

    messages.push({ role: "system", content: userContext });

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
                model: "gpt-4",
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
    console.log(`Question: ${messages.at(-1).content}\nAnswer: ${chatGPTResult}`);
    console.log(`${messages}`)

    let question = messages.at(-1).content;
    let answer = chatGPTResult;

    if (!req.session.chatHistory) {
        req.session.chatHistory = [];
    }
    req.session.chatHistory.push({ question, answer });

    res.json({ assistant: chatGPTResult });
});

/**
 * Route for saving the current conversation to the database
 * @name post/saveConversation
 * @function
 * @memberof module:routers/ai
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * Route for saving a chat to a text file
 * @name post/saveChat/:id
 * @function
 * @memberof module:routers/ai
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * Route for deleting a chat from the database
 * @name post/deleteChat/:id
 * @function
 * @memberof module:routers/ai
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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
