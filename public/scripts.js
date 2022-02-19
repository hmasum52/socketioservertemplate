//const socket = io('http://localhost:3002');
const socket = io('https://8doq1v.sse.codesandbox.io/');

const messageContainer = document.querySelector("#message-container");
const messageForm = document.querySelector("#send-message-container");
const mesassgeInput = document.querySelector("#message-input");

const chatMessageEvent = 'chat-message';
const sendChatMessageEvent = 'send-chat-message';
const userConnectedEvent = 'user-connected';
const userConnectedToServerEvent = 'user-connected-to-server';

// on user connect
const userName = prompt("Enter your name");
appendMessage(`You joined as ${userName}`);
socket.emit(userConnectedToServerEvent, userName);


socket.on(userConnectedEvent, function(msg){
    appendMessage(`${msg}`);
});

socket.on(chatMessageEvent, function(data){
    console.log(`recieved message: ${data}`);
    appendMessage(`${data.name} : ${data.message}`);
})

messageForm.addEventListener('submit', function(e){
    e.preventDefault();
    const message = mesassgeInput.value;
    console.log(`sending message: ${message}`)
    appendMessage(`You: ${message}`);
    socket.emit(sendChatMessageEvent, message);
    mesassgeInput.value = '';
});

function appendMessage(message){
    console.log(`appending message : ${message}`)
    const messageElement = document.createElement("div");
    messageElement.innerText = message;

    messageContainer.append(messageElement);
}