const express = require('express');
const dotenv = require('dotenv');

const mongoose = require('mongoose');
const userRoutes = require('../routes/userRoutes');
const chatRoutes = require('../routes/chatRoutes');
const messageRoutes = require('../routes/messageRoutes');
const { notFound, errorHandler } = require('../middlerware/errorMiddleware');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

dotenv.config();

app.use(express.json()); // To accept JSON data
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.get('/', (req, res) => {
  res.send('Hello world from SERVER!');
});

// ======================= Deployment =======================

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname1, '..', 'client', 'build', 'index.html')
    );
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is Running successfully');
  });
}

// ======================= Deployment =======================

app.use(notFound);
app.use(errorHandler);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: `, conn.connection.host);
  } catch (error) {
    console.error('Error: ', error);
    process.exit;
  }
};
connectDB();
const port = process.env.PORT || 5000;

const server = app.listen(port, console.log(`Listening on port ${port}`));

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: { origin: 'http://localhost:3000' },
});

io.on('connection', (socket) => {
  console.log('Connected to Socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined room - ', room);
  });

  socket.on('typing', (room) => {
    socket.in(room).emit('typing');
  });

  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing');
  });

  socket.on('new message', (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });
  socket.off('setup', () => {
    console.log('User Disconnected');
    socket.leave(userData._id);
  });
});
