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

// 2. Define Clean Schema for Chats
const chatSchema = new mongoose.Schema({
  roomId: String,
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});
const Chat = mongoose.model('Chat', chatSchema);

// Health Check Endpoint
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

// 3. Socket.IO Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', async ({ roomId, user }) => {
    socket.join(roomId);
    
    // Send history from DB
    const history = await Chat.find({ roomId }).sort({ timestamp: 1 }).limit(50);
    socket.emit('history', history);
  });

  socket.on('send_message', async (data) => {
    const { roomId, sender, text } = data;
    
    // Save to DB
    const newMsg = new Chat({ roomId, sender, text });
    await newMsg.save();

    // Broadcast to Room
    io.to(roomId).emit('receive_message', newMsg);
    
    // Auto-Reply Simulation (Optional, remove if real users connect)
    // if (sender !== 'System') {
    //     setTimeout(async () => {
    //         const replyText = `(Echo) You said: ${text}`; 
    //         const reply = new Chat({ roomId, sender: 'System', text: replyText });
    //         await reply.save();
    //         io.to(roomId).emit('receive_message', reply);
    //     }, 1000);
    // }
  });
});

// 4. Daily Cleanup Task (Midnight)
// Clears ALL chat history every day at 00:00
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily cleanup: Deleting all chat history...');
  await Chat.deleteMany({});
  io.emit('system_alert', 'Daily cleanup: Chat history has been cleared.');
});

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
