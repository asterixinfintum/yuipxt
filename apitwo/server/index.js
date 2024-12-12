if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}

import "regenerator-runtime/runtime.js";
import express from "express";
import http from "http";
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import socket from 'socket.io';
import cron from "node-cron";

const { formatDistanceToNow } = require('date-fns');

import User from './models/user';

const app = express();
const server = http.createServer(app);

const allowlist = ['https://tradexquant.com', 'https://www.tradexquant.com', 'https://app.tradexquant.com'];

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;

    let isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;

    if (isDomainAllowed) {
        corsOptions = { origin: true }
    } else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate));

const io = socket(server, {
    cors: {
        origin: [`${process.env.baseurl}`, `${process.env.wwwbaseurl}`],
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true
    }
});

let ioInstance;

function initSocketIO() {
    io.on('connection', (socket) => {
        console.log('A user connected now');

        socket.on('clientloggedin', async (data) => {
            console.log('User disconnected now', data);
            socket.clientid = data.clientid;

            const client = await User.findOne({ _id: socket.clientid });

            if (client) {
                await User.findOneAndUpdate(
                    { _id: socket.clientid },
                    {
                        $set: {
                            online: true
                        }
                    },
                    { new: true }
                );

                io.emit('updateclientonlinestate', { userid: socket.clientid });
            }
        });

        socket.on('clientloggedout', async (data) => {
            console.log('User disconnected now', data);
            socket.clientid = data.clientid;

            const client = await User.findOne({ _id: socket.clientid });

            if (client) {
                await User.findOneAndUpdate(
                    { _id: socket.clientid },
                    {
                        $set: {
                            online: false,
                            lastOnline: new Date()
                        }
                    },
                    { new: true }
                );

                //await updateUserLastOnlineAgo(socket.clientid);

                io.emit('updateclientonlinestate', { userid: socket.clientid });

                socket.clientid = null;
                socket.token = null;

                console.log(socket.clientid, socket.token);
                console.log('User disconnected now');
            }
        });

        socket.on('userdetailupdated', async (data) => {
            io.emit('updateuserdetail', { userid: data.clientid });
        });

        socket.on('updateprices', async () => {
            io.emit('updateclientprices');
        });

        socket.on('disconnect', async () => {
            await User.findOneAndUpdate(
                { _id: socket.clientid },
                {
                    $set: {
                        online: false,
                        lastOnline: new Date()
                    }
                },
                { new: true }
            );

            //await updateUserLastOnlineAgo(socket.clientid);

            io.emit('updateclientonlinestate', { userid: socket.clientid });

            socket.clientid = null;
            socket.token = null;

            console.log(socket.clientid, socket.token);
            console.log('User disconnected now');
        });
    });

    io.use(async (socket, next) => {
        const token = socket.handshake.headers.authorization;

        if (token && token.startsWith('Bearer ')) {
            const actualToken = token.split(' ')[1];

            socket.token = actualToken;
        }

        next();
    });

    ioInstance = io;
}

/*async function updateUserLastOnlineAgo(userId) {
    const user = await User.findById(userId);

    if (user && user.lastOnline) {
        // Calculate 'lastOnlineAgo' using date-fns
        const lastOnlineAgo = formatDistanceToNow(new Date(user.lastOnline), { addSuffix: true });

        // Optionally update 'lastOnlineAgo' in the document if needed
        user.lastOnlineAgo = lastOnlineAgo;
        await user.save();
    }

    return user;
}*/

import mongoose from 'mongoose';

app.use(express.urlencoded({
    extended: false
}));

app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 8083;

mongoose.connect(`${process.env.DB}`, {
    //mongodb://db:27017/traderapiv2 =====> production
    //mongodb://127.0.0.1:27017/traderapiv2 ===> development

    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('connected to database');
    server.listen(PORT, async (error) => {
        if (error) {
            return error;
        }

        initSocketIO();
        return console.log(`server started on port here now ${PORT}`);
    });
});