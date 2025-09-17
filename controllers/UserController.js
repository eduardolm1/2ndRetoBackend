const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.updateProfileImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'profile_images' });
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profileImage: result.secure_url },
            { new: true }
        );
        res.json({ message: 'Imagen actualizada', profileImage: user.profileImage });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar imagen', error });
    }
};
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

            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            
            let tokens = user.tokens || [];
            if (tokens.length > 3) tokens = tokens.slice(1);
            tokens.push(token);
            await User.updateOne({ _id: user._id }, { tokens });

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
    async getUsers(req, res) {
        try {
            const users = await User.find()
                .select("name email age followers following createdAt profileImage")
                .limit(50)
                .lean();

            res.status(200).send(users);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error al obtener usuarios", error });
        }
    },
    //Get info
    async getInfo(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId)
                .populate({
                    path: 'followers',
                    select: 'name email'
                })
                .populate({
                    path: 'following',
                    select: 'name email'
                });

            const Post = require('../models/Post');
            const posts = await Post.find({ userId: userId });

            const userData = user.toObject();
            userData.posts = posts;

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
    },
    //Update 
    async update(req, res) {
        try {
            const user = await User.findById(req.user._id);
            if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });

            const { password, ...updateData } = req.body;

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, { folder: 'profile_images' });
                updateData.profileImage = result.secure_url;
            }

            const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
                new: true
            }).select("-password -tokens");

            res.status(200).send({ message: 'Usuario actualizado', user: updatedUser });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al actualizar', error });
        }
    }
};

module.exports = UserController;