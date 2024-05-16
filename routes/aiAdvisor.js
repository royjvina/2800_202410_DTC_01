const express = require('express');
const router = express.Router();
const OpenAI = require("openai");
const constants = require('../constants.json');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const { MongoClient } = require('mongodb');

const mongodb_uri = process.env.MONGODB_URI;
const mongodb_database = process.env.MONGODB_DATABASE;

let chatHistoryCollection;

(async () => {
    const client = new MongoClient(mongodb_uri);
    try {
        await client.connect();

        const database = client.db(mongodb_database);
        chatHistoryCollection = database.collection('chatHistory');
    } catch (error) {
        console.error("Error connecting to MongoDB-AI:", error);
    }
})();

router.get('/AI', (req, res) => {
    res.render('aiAdvisor');
});

router.post('/advisor', async function (req, res) {
    let { userMessages, assistantMessages } = req.body;

    let messages = [
        { role: "system", content: constants.SYSTEM_COMMENT },
        { role: "user", content: constants.USER_COMMENT },
        { role: "assistant", content: constants.ASSISTANT_COMMENT },
    ];

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "' +
                    String(userMessages.shift()).replace(/\n/g, "") + '"}')
            );
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "' +
                    String(assistantMessages.shift()).replace(/\n/g, "") + '"}')
            );
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
    console.log(`Question: ${messages.at(-1).content}\nAnswer: ${chatGPTResult}`);

    let question = messages.at(-1).content;
    let answer = chatGPTResult;


    // await chatHistoryCollection.insertOne({ question, answer, timestamp: new Date() });

    // if (req.session.qaPair) {
    //     req.session.qaPair.push({ question, answer, timestamp: new Date() });
    // } else {
    //     req.session.qaPair = [{ question, answer, timestamp: new Date() }];
    // }

    // req.session.save((err) => {
    //     if (err) {
    //         console.error('Error saving session:', err);
    //     }
    // });

    res.json({ "assistant": chatGPTResult });
});

module.exports = router;