require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const userRoutes =  require('./routes/user-routes.js')
const apiRoutes = require('./routes/apiRoutes.js')
const cookieParser = require('cookie-parser')
const { requireAuth, loggedInUser, getCurrentUsername } = require('./middlewares/authMiddlewares.js');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path')
const staticPath = path.join(__dirname, '../public/')
const jwt = require('jsonwebtoken')
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server);
const user = require('./models/userdb')
const Chat = require('./models/chatdb')

// middleware
app.use(cookieParser());
app.get('/',requireAuth, (req,res)=>{
    res.sendFile(path.join(__dirname, '../public/app.html'))
});
app.get('/app.html',requireAuth, (req,res)=>{
    res.sendFile(path.join(__dirname, '../public/app.html'))
});
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname , '../node_modules/socket.io-client/dist/socket.io.js'));
});

app.use(express.static(staticPath))
app.use(express.json());


//database connection

mongoose.connect(process.env.DB_URI)
.then(()=>{server.listen(port); console.log('server started')}).catch((Err)=>{console.log(Err)})


//routes

app.use(userRoutes);
app.use(apiRoutes);

// socket io 

io.on('connection', (socket) => {

    socket.on('chat', (data) => {
        
        const { msg, sender, receiver } = data;

        // Create a new chat message using the Chat model
        const newChat = new Chat({
            sender,
            receiver,
            message: msg
        });

        // Save the chat message to the database
        newChat.save()
            .then((savedChat) => {
                console.log('Chat message saved to MongoDB');
                const savedData = {
                    msg,
                    sender,
                    receiver,
                    timestamp: savedChat.createdAt // Include the timestamp
                };
                io.emit('chat', savedData); // Emit the data with timestamp
            })
            .catch((error) => {
                console.error('Error saving chat message to MongoDB:', error);
            });

    });
});


