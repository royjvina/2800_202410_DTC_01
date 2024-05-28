const messages = document.querySelector('.messages');
const input = document.getElementById('userInput');
const button = document.getElementById('sendBtn');
const loading = document.getElementById('loading');
const inputContainer = document.getElementById('inputContainer');
const historyButton = document.querySelector('.history-icon');

let chatCnt = 0;
let userMessages = [];
let assistantMessages = [];

function startChat() {
    document.getElementById("introContainer").style.display = "none";
    document.getElementById("introQuestion").style.display = "none";
    document.getElementById("saveBtn").style.display = "block";
    document.getElementById("toDo").style.display = "block";
    document.getElementById("chat").style.display = "block";
    inputContainer.style.display = "flex";
    username = messageBox.getAttribute('data-src');
}

function noStartChat() {
    alert('Thank you! You can start the chat later.');
}

historyButton.addEventListener("click", () => {
    window.location.href = '/history';
});

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

button.addEventListener("click", sendMessage);

function appendMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message');
    message.classList.add(sender.toLowerCase());
    message.innerText = text;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    if (sender === 'me') {
        userMessages.push(text);
    } else {
        assistantMessages.push(text);
    }

    chatCnt++;
}

async function sendMessage() {
    const query = input.value;
    if (!query) return;
    appendMessage(query, 'me');
    input.value = '';
    loadingOn();
    try {
        const response = await fetch("/advisor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userMessages, assistantMessages }),
        });
        const prediction = await response.json();
        appendMessage(prediction.assistant, 'bot');
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Something broke: ' + error);
    } finally {
        loadingOff();
    }
}

function loadingOn() {
    loading.style.display = 'block';
}

function loadingOff() {
    loading.style.display = 'none';
    button.disabled = false;
}

async function saveConversation() {
    try {
        const response = await fetch('/saveConversation', { method: 'POST' });
        if (response.ok) {
            console.log('Conversation saved successfully.');
            alert('Conversation saved successfully.');
        } else {
            console.error('Failed to save conversation.');
            alert('Failed to save conversation.');
        }
    } catch (error) {
        console.error('Error saving conversation:', error);
        alert('Error saving conversation: ' + error);
    }
}
