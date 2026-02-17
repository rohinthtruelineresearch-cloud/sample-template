const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 1. Connect to MongoDB (Local for now, can be Cloud)
const MONGO_URI = 'mongodb+srv://rohinthtruelineresearch_db_user:hUPZPTzzXMg5pTPZ@cluster0.ksbuhpi.mongodb.net/notepad_messenger?appName=Cluster0';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected to notepad_messenger'))
  .catch(err => console.error(err));

// 2. Define Schemas

// User Profile Schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatar: { type: String, default: '' }, // Avatar emoji or image URL
  status: { type: String, default: 'Hey there! I am using Notepad Messenger' },
  background: { type: String, default: '#e5ddd5' }, // WhatsApp default
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Chat Message Schema (updated with avatar)
const chatSchema = new mongoose.Schema({
  roomId: String,
  sender: String,
  senderId: String, // Unique user ID
  avatar: String, // Sender's avatar
  text: String,
  replyTo: { // Quoted message context
    sender: String,
    text: String
  },
  timestamp: { type: Date, default: Date.now }
});
const Chat = mongoose.model('Chat', chatSchema);
console.log('Chat model loaded');


// Middleware
app.use(express.json());

// Health Check Endpoints
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Notepad Messenger Server is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// User Profile API Endpoints
app.post('/api/users', async (req, res) => {
  try {
    const { userId, username, avatar, status, background } = req.body;
    let user = await User.findOne({ userId });
    
    if (user) {
      // Update existing user
      user.username = username || user.username;
      user.avatar = avatar !== undefined ? avatar : user.avatar;
      user.status = status !== undefined ? status : user.status;
      user.background = background || user.background;
      await user.save();
    } else {
      // Create new user
      user = new User({ userId, username, avatar, status, background });
      await user.save();
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear chat endpoint
app.delete('/api/chats/:userId', async (req, res) => {
  try {
    await Chat.deleteMany({ roomId: 'global-room' });
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Database Persistence for Messages
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', async ({ roomId, user }) => {
    socket.join(roomId);
    
    try {
      // Load message history from database
      const history = await Chat.find({ roomId })
        .sort({ timestamp: 1 })
        .limit(100) // Optional: limit to last 100 messages
        .lean();
      
      socket.emit('history', history);
      console.log(`Loaded ${history.length} messages for room ${roomId}`);
    } catch (error) {
      console.error('Error loading chat history:', error);
      socket.emit('history', []); // Send empty array on error
    }
  });

  socket.on('send_message', async (data) => {
    const { roomId, sender, senderId, avatar, text, replyTo } = data;
    
    try {
      // Save message to database
      const newMsg = new Chat({
        roomId,
        sender,
        senderId,
        senderId,
        avatar: avatar || '👤',
        text,
        replyTo,
        timestamp: new Date()
      });
      
      await newMsg.save();
      console.log(`Message saved to DB: ${roomId} - ${sender}`);

      // Broadcast to Room
      io.to(roomId).emit('receive_message', {
        roomId: newMsg.roomId,
        sender: newMsg.sender,
        senderId: newMsg.senderId,
        avatar: newMsg.avatar,
        text: newMsg.text,
        replyTo: newMsg.replyTo,
        timestamp: newMsg.timestamp
      });
    } catch (error) {
      console.error('Error saving message:', error);
      // Still broadcast the message even if DB save fails
      io.to(roomId).emit('receive_message', {
        roomId,
        sender,
        text,
        timestamp: new Date()
      });
    }
  });

  socket.on('clear_chat', async ({ roomId }) => {
    try {
      // Delete all messages for this room from database
      await Chat.deleteMany({ roomId });
      console.log(`Cleared chat history for room ${roomId}`);
      
      // Notify all users in the room that chat was cleared
      io.to(roomId).emit('chat_cleared');
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  });
});

// 4. Database Persistence: Messages are now permanently stored in MongoDB
// Old messages can be cleaned up with a scheduled task if needed

// 5. Keep-Alive: Ping server every 14 minutes to prevent sleep on Render
// Runs every 14 minutes to keep the server active
cron.schedule('*/14 * * * *', async () => {
  try {
    const https = require('https');
    https.get('https://sample-template-bxgm.onrender.com/health', (res) => {
      console.log(`Keep-Alive ping: ${res.statusCode}`);
    }).on('error', (err) => {
      console.log('Keep-Alive ping failed:', err.message);
    });
  } catch (error) {
    console.log('Keep-Alive error:', error.message);
  }
});

// Start Server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
