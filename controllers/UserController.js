const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/keys.js')
const UserController = {
    //Register
    async register(req, res) {
        try {
            const user = await User.create(req.body);
            res.status(201).send({ message: 'Usuario creado correctamente', user })
        } catch (error) {
            console.error(error)
            res.status(500).send({ error, message: 'Error al crear el usuario' })
        }
    },
    //Login
    async login(req, res) {
        try {
            const user = await User.findOne({
                email: req.body.email
            })
            const token = jwt.sign({ _id: user._id }, jwt_secret)
            if (user.tokens.length > 3) user.tokens.shift();
            user.tokens.push(token);
            await user.save();
            res.status(200).send({ message: 'Bienvenid@ ' + user.name })
        } catch (error) {
            console.error(error)
            res.status(500).send({ error, message: 'Error al iniciar sesion' })
        }
    },
    //Get info

    //Logout
    async logout(req, res){
        try {
            
        } catch (error) {
            console.error(error)
            res.status(500).send({ error, message: 'Error al cerrar sesión' })
            
        }
    }
}

module.exports = UserController;