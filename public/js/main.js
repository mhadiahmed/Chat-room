const socket = io();
const chatForm = document.getElementById('chat-form');
const ChatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get username and room name from the query
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// get room users
socket.on('roomUsers', ({ room, users }) => {
    outPutRoomName(room);
    outPutUsers(users);
});

// Join Room
socket.emit('joinRoom', { username, room })

// message from server
socket.on('message', (message) => {
    // console.log(message);
    outPutMessage(message);
    ChatMessage.scrollTop = ChatMessage.scrollHeight;
});


chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let msg = e.target.elements.msg.value;
    msg = msg.trim();
    if (!msg) {
        return false;
    }

    socket.emit('chateMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// out put message on DOM
function outPutMessage(message) {
    // div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>`;
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
};


function outPutRoomName(room) {
    roomName.innerHTML = room;
}

function outPutUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}