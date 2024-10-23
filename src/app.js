
const express = require('express');
const { config } = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
config();

const bookRoutes = require('./routers/book.routes');

//middleware (usamos -> express)
const app = express();
app.use(bodyParser.json()); // parceador de bodies

// conectamos la BD
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME});
const db = mongoose.connection;

app.use('/books', bookRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`servidor inciado en el puerto: ${port}`);
});