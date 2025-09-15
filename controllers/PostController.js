const Post = require('../models/Post');

const PostController = {

    async create(req, res) {
        try {
            const { name, content } = req.body;

            if (!name || !content) {
                return res.status(400).send({ message: 'Nombre y contenido son requeridos' });
            }

            let images = [];
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    if (file.mimetype.startsWith('image/')) {
                        images.push(file.path);
                    }
                });
            }
            let post = await Post.create({
                name,
                content,
                images,
                userId: req.user._id
            });

            post = await Post.findById(post._id)
                .populate('userId', 'name email followers')
                .populate({
                    path: 'comments',
                    populate: { path: 'userId', select: 'name email' }
                });

            res.status(201).send({ message: 'Post creado correctamente', post });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al crear el post', error });
        }
    },

    async update(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) return res.status(404).send({ message: 'Post no encontrado' });

            if (post.userId.toString() !== req.user._id.toString()) {
                return res.status(403).send({ message: 'No autorizado' });
            }

            let updateData = { ...req.body };

            // Procesar nuevos archivos si se suben
            if (req.files && req.files.length > 0) {
                const images = [];
                req.files.forEach(file => {
                    if (file.mimetype.startsWith('image/')) {
                        images.push(file.path);
                    }
                });
                if (images.length > 0) {
                    updateData.images = images;
                }
            }

            const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, {
                new: true
            })
            .populate('userId', 'name email followers')
            .populate({
                path: 'comments',
                populate: { path: 'userId', select: 'name email' }
            });

            res.status(200).send({ message: 'Post actualizado', post: updatedPost });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al actualizar', error });
        }
    },

    async delete(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).send({ message: 'Post no encontrado' });
            }
            if (post.userId.toString() !== req.user._id.toString()) {
                return res.status(403).send({ message: 'No autorizado. Solo el propietario puede eliminar este post' });
            }

            // NOTA: Con Cloudinary, los archivos se mantienen en la nube
            // Puedes implementar lógica para borrarlos de Cloudinary si lo deseas

            await Post.findByIdAndDelete(req.params.id);

            res.status(200).send({
                message: 'Post borrado correctamente',
                id: req.params.id
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Ha habido un problema al borrar el post', error });
        }
    },

    // Los demás métodos (getAll, getPostByName, getPostById, like, dislike) se mantienen igual
    async getAll(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const posts = await Post.find()
                .populate('userId', 'name email followers')
                .populate({
                    path: 'comments',
                    populate: { path: 'userId', select: 'name email' }
                })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 });

            const total = await Post.countDocuments();

            res.status(200).send({
                posts,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Ha habido un problema al obtener los post', error });
        }
    },

    async getPostByName(req, res) {
        try {
            const posts = await Post.find({
                $text: {
                    $search: req.params.name
                }
            })
                .populate('userId', 'name email followers')
                .populate({
                    path: 'comments',
                    populate: { path: 'userId', select: 'name email' }
                });

            res.send(posts);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al buscar posts', error });
        }
    },

    async getPostById(req, res) {
        try {
            const post = await Post.findById(req.params._id)
                .populate('userId', 'name email followers')
                .populate({
                    path: 'comments',
                    populate: { path: 'userId', select: 'name email' }
                });

            if (!post) {
                return res.status(404).send({ message: 'Post no encontrado' });
            }

            res.status(200).send(post);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al obtener el post', error });
        }
    },

    async like(req, res) {
        try {
            const post = await Post.findByIdAndUpdate(
                req.params._id,
                { $addToSet: { likes: req.user._id } },
                { new: true }
            )
                .populate("userId", "name email followers")
                .populate({
                    path: "comments",
                    populate: { path: "userId", select: "name email" }
                });

            res.send(post);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There was a problem with your request" });
        }
    },

    async dislike(req, res) {
        try {
            const post = await Post.findByIdAndUpdate(
                req.params._id,
                { $pull: { likes: req.user._id } },
                { new: true }
            )
                .populate("userId", "name email followers")
                .populate({
                    path: "comments",
                    populate: { path: "userId", select: "name email" }
                });

            res.status(200).send(post);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error al hacer dislike" });
        }
    },

  
}

module.exports = PostController;