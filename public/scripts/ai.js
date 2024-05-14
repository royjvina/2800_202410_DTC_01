const messages = document.querySelector('.messages');
const input = document.getElementById('user-input');
const button = document.getElementById('send-btn');
const loading = document.getElementById('loading');
let chatCnt = 0;
let userMessages = [];
let assistantMessages = [];


function startChat() {
    document.getElementById("intro-container").style.display = "none";
    document.getElementById("intro-question").style.display = "none";
    document.getElementById("chat").style.display = "block";
    let welcomeMsg = "Hello!"
    appendMessage(welcomeMsg, 'bot');
}

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function appendMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message');
    message.classList.add(sender.toLowerCase());
    message.innerText = text;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    if (sender == "me") {
        userMessages.push(text)
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
        const response = await fetch("http://localhost:3000/advisor", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ "userMessages": userMessages, "assistantMessages": assistantMessages }),
        })
        const prediction = await response.json();
        appendMessage(prediction.assistant, 'bot');
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Something broke.:' + error)
    } finally {
        loadingOff();
        document.getElementById("intro-message").innerHTML = ""
    }
}

function loadingOn() {
    loading.style.display = 'block'
}

function loadingOff() {
    loading.style.display = 'none'
    button.disabled = false;
}