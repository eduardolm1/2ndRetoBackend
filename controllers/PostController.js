const Post = require('../models/Post');

const PostController = {

    //create (validacion de rellenado de todos los campos excepto imagen )

    async create(req, res) {
        try {
            const { name, content } = req.body;
            if (!name || !content) {
                return res.status(400).send({ message: 'Nombre y contenido son requeridos' });
            }
            const post = await Post.create({
                ...req.body,
                userId: req.user._id
            });
            res.status(201).send({ message: 'Post creado correctamente', post });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al crear el post', error });
        }
    },

    //updateV
    async update(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) return res.status(404).send({ message: 'Post no encontrado' });

            if (post.userId.toString() !== req.user._id.toString()) {
                return res.status(403).send({ message: 'No autorizado' });
            }

            const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
                new: true
            });
            res.status(200).send({ message: 'Post actualizado', post: updatedPost });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al actualizar' });
        }
    },
    //delete(autentificacion )V

    async delete(req, res) {
        try {
            const post = await Post.findByIdAndDelete(req.params.id)
            res.status(204).send({ message: 'Post borrado correctamente' })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al borrarlo' })
        }
    },

    //traer posts junto a users y comentarios de dichos post y paginacion de 10 en 10

    async getAll(req, res) {
        try {
            const { page = 1, limit = 5 } = req.query
            const post = await Post.find()
                .populate({
                    path: 'comments',
                    populate: { path: 'userId', select: 'name email' }
                })
                .populate('userId', 'name email')
                .limit(limit)
                .skip((page - 1) * limit)
            res.status(200).send(post)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al obtener los post', error })

        }
    },

    //buscar por nombre post
    async getPostByName(req, res) {
        try {
            const post = await Post.find({
                $text: {
                    $search: req.params.name
                }
            })
            res.send(post)
        } catch (error) {
            console.error(error)
        }
    },

    //buscar por id posts
    async getPostById(req, res) {
        try {
            const productId = await Post.findById(req.params._id)
            res.status(200).send(productId)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Producto no encontrado por el id' })
        }
    },
    //like
    async like(req, res) {
        try {
            const product = await Post.findByIdAndUpdate(
                req.params._id,
                { $push: { likes: req.user._id } },
                { new: true }
            )

            res.send(product)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'There was a problem with your request' })
        }
    },
    //dislike
    async dislike(req, res) {
        try {
            const post = await Post.findByIdAndUpdate(
                req.params._id,
                { $pull: { likes: req.user._id } },
                { new: true }
            );
            res.status(200).send({ message: 'Dislike realizado', post });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al hacer dislike' });
        }
    }



}

module.exports = PostController;