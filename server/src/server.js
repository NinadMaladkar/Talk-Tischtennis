const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const userRoutes = require('../routes/userRoutes');
const chatRoutes = require('../routes/chatRoutes');
const { notFound, errorHandler } = require('../middlerware/errorMiddleware');
const cors = require('cors');
const bodyParser = require('body-parser');

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

app.use(notFound);
app.use(errorHandler);

connectDB();
const port = process.env.PORT || 5000;

app.listen(port, console.log(`Listening on port ${port}`));
