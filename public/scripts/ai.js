const messages = document.querySelector('.messages'); // Container for messages
const input = document.getElementById('userInput'); // User input field
const button = document.getElementById('sendBtn'); // Send button
const loading = document.getElementById('loading'); // Loading indicator
const inputContainer = document.getElementById('inputContainer'); // Container for the input field
const historyButton = document.querySelector('.history-icon'); // History button

let chatCnt = 0; // Counter for chat messages
let userMessages = []; // Array to store user messages
let assistantMessages = []; // Array to store assistant messages

/**
 * Function to start the chat. Hides intro elements and shows chat elements.
 */
function startChat() {
    document.getElementById("introContainer").style.display = "none";
    document.getElementById("introQuestion").style.display = "none";
    document.getElementById("saveBtn").style.display = "block";
    document.getElementById("toDo").style.display = "block";
    document.getElementById("chat").style.display = "block";
    inputContainer.style.display = "flex";
    username = messageBox.getAttribute('data-src'); // Retrieve the username from a data attribute
}

/**
 * Function to alert the user that the chat can be started later.
 */
function noStartChat() {
    alert('Thank you! You can start the chat later.');
}

// Redirect to history page when history button is clicked
historyButton.addEventListener("click", () => {
    window.location.href = '/history';
});

// Send message when Enter key is pressed in the input field
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Send message when send button is clicked
button.addEventListener("click", sendMessage);

/**
 * Function to append a message to the chat.
 * @param {string} text - The message text
 * @param {string} sender - The sender of the message ('me' or 'bot')
 */
function appendMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message');
    message.classList.add(sender.toLowerCase());
    message.innerText = text;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    if (sender === 'me') {
        userMessages.push(text); // Store user message
    } else {
        assistantMessages.push(text); // Store assistant message
    }

    chatCnt++; // Increment chat counter
}

/**
 * Function to send a message. Sends user message to the server and displays the assistant's response.
 */
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

/**
 * Function to show the loading indicator.
 */
function loadingOn() {
    loading.style.display = 'block';
}

/**
 * Function to hide the loading indicator and enable the send button.
 */
function loadingOff() {
    loading.style.display = 'none';
    button.disabled = false;
}

/**
 * Function to save the conversation.
 */
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
