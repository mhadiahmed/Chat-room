const express = require('express');
const app = require('express')();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const formatMSG = require('./utils/message');
const { userJoin, userLeave, getCurrentUser, getRoomUsers } = require('./utils/user');
// set static file dirctory

app.use(express.static(path.join(__dirname, 'public')))
const botName = 'Demo-Bot';
// run when client connect 
io.on('connection', (socket) => {
    // console.log('new connection ...');

    // handle room join

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // this for single client
        socket.emit('message', formatMSG(botName, 'welcome to my new chat'));

        // all the users except me
        socket.broadcast.to(user.room).emit('message', formatMSG(botName, `${user.username} has connect to the chat..`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });


    //all the users
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMSG(botName, `${user.username} has disconnect from the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        };

    });

    socket.on('chateMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMSG(user.username, msg));
        }
    });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Listening to on ${PORT} !`)
})