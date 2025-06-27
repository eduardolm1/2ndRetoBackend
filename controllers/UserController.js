const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config()


const UserController = {
    //Register
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).send({ message: 'Todos los campos son requeridos' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                ...req.body,
                password: hashedPassword,
                role: 'user'
            });

            res.status(201).send({ message: 'Usuario creado correctamente', user });
        } catch (error) {
            console.error(error);
            if (error.code === 11000) {
                res.status(400).send({ message: 'El email ya está registrado' });
            } else {
                res.status(500).send({ message: 'Error al registrar usuario' });
            }
        }
    },
    //Login
    async login(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).send({ message: 'Credenciales incorrectas' });
            }
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).send({ message: 'Credenciales incorrectas' });
            }

            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            if (user.tokens.length > 3) user.tokens.shift();
            user.tokens.push(token);
            await user.save();
            res.status(200).send({
                message: 'Bienvenid@ ' + user.name,
                token,
                user: { _id: user._id, name: user.name, email: user.email }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al iniciar sesión' });
        }
    },
    //Get info
    async getInfo(req, res) {
        try {
            const user = await User.findById(req.user._id)
                .populate({
                    path: 'posts',
                })
                .populate({
                    path: 'followers',
                    select: 'name email'
                })
                .populate({
                    path: 'following',
                    select: 'name email'
                })

            res.status(200).send(userData);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al obtener información', error });
        }
    },
    //Logout
    async logout(req, res) {
        try {
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { tokens: req.headers.authorization }
            });
            res.send({ message: 'Sesión cerrada con éxito' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error, message: 'Error al cerrar sesión' });
        }
    }
};

module.exports = UserController;