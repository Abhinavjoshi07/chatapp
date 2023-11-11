const users = require('../models/userdb')
const Chat = require('../models/chatdb')
const jwt = require('jsonwebtoken')
require('dotenv').config



// show users api


module.exports.checkUser = async (req, res) => {
    try {
        console.log('request recieved')
        const token = await req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        // Fetch the current user
        const currentUser = await users.findById(userId);
       
        


        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all users except the current user
        const allUsersExceptCurrentUser = await users.find({ _id: { $ne: userId } }, 'username');

        // Extract usernames from the user documents
        const userNames = allUsersExceptCurrentUser.map(user => user.username);

        const responseObj = {
            allUsernames: userNames,
            currentUserUsername: currentUser.username,
        };

        res.json( responseObj );
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.chats = async (req, res) => {
  try {
    const { sender, receiver } = req.body; // Assuming the sender and receiver are sent in the request body

    // Use Mongoose to query the database for messages matching either sender or receiver
    const messages = await Chat.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }, // Check for the reverse case
      ],
    });

    res.status(200).json(messages);
   
  } catch (error) {
    console.error('Error retrieving chat messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
