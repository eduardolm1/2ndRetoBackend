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
app.use('/follow', require('./routes/follow'))
app.use(typeError)

app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

dbConnection()

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en PORT : ${PORT}`)
  });
}