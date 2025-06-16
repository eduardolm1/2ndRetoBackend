const express = require('express');
const app = express();
const { dbConnection } = require('./config/config');
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor escuchando en PORT : ${PORT}`)
});
