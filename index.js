import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import morgan from 'morgan';

const app = express();
app.use(morgan("dev"));
/* const server = http.createServer(app); */


app.get('/', (
    req, res) => {
    res.send('<h1>Hello world</h1>');
});

const server = app.listen(3002, function () {
    console.log(`server running at port 3002`);
})


const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const userIdSocketMap = {}; // userid, socket
const socketUserIdMap = {}

const SEND_MESSAGE = 'send-message';
const RECEIVE_MESSAGE = 'receive-message';
const USER_REGISTER = 'user-register';
const DISCONNECT = "disconnect";

const userConnectedToServerEvent = 'user-connected-to-server';

io.on('connection', function (socket) {
    console.log(`Connected successfully ${socket.id}`);

    socket.on(USER_REGISTER, function (userId) {
        if (socketUserIdMap[socket.id] !== undefined) {
            const userId = socketUserIdMap[socket.id];
            delete socketUserIdMap[socket.id];
            delete userIdSocketMap[userId];
        }

        if (userIdSocketMap[userId] === undefined) {
            userIdSocketMap[userId] = socket.id;
            socketUserIdMap[socket.id] = userId;
            console.log(userId, "started listenting", "at socket id", socket.id);
        }
    });

    socket.on(DISCONNECT, function () {
        console.log(`Disconnected successfully`, socket.id);
        const userId = socketUserIdMap[socket.id];
        delete socketUserIdMap[socket.id];
        delete userIdSocketMap[userId];
    });

    socket.on(SEND_MESSAGE, function (data) {
        console.log(`received message:`, data);
        // socket.broadcast.emit(RECEIVE_MESSAGE, data);
        const senderId = data.sender_id;
        //onlineUsersScoketMap[senderId] = socket.id;
        if (data.receiver_id !== undefined) {
            const receiverSocketId = userIdSocketMap[data.receiver_id];
            console.log("receiver", data.receiver_id, receiverSocketId);
            if (receiverSocketId !== undefined)
                io.to(receiverSocketId).emit(RECEIVE_MESSAGE, data); //https://socket.io/docs/v3/emit-cheatsheet/
        }

    });
});

