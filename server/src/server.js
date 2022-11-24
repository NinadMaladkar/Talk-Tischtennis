const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const userRoutes = require('../routes/userRoutes');
const { notFound, errorHandler } = require('../middlerware/errorMiddleware');

const app = express();

dotenv.config();
app.use(express.json()); // To accept JSON data

app.use('/api/user', userRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB();
const port = process.env.PORT || 5000;

app.listen(port, console.log(`Listening on port ${port}`));
