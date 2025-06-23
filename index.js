const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { dbConnection } = require('./config/config');
const { typeError } = require('./middlewares/errors')
require('dotenv').config()



app.use(express.json());
app.use('/users', require('./routes/user'))
app.use('/posts', require('./routes/post'))
app.use('/comments', require('./routes/comment'))
app.use(typeError)

dbConnection()


app.listen(PORT, () => {
    console.log(`Servidor escuchando en PORT : ${PORT}`)
});
