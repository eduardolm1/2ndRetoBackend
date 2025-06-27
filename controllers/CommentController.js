const Post = require('../models/Post');
const Comment = require('../models/Comment');

const CommentController = {
    //Crear comentario en post
    async create(req, res) {
        try {
            const { content } = req.body;
            if (!content) return res.status(400).send({ message: 'El contenido del comentario es requerido' });
            const post = await Post.findById(req.params.postId);

            if (!post) return res.status(404).send({ message: 'Post no encontrado' });

            const comment = await Comment.create({
                text: content,
                userId: req.user._id,
                postId: post._id
            });
            post.comments.push(comment._id);
            await post.save();

            res.status(201).send({ message: 'Comentario añadido correctamente', comment });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al añadir el comentario', error });
        }
    },
    // obtener comentarios por post
    async getByPost(req, res) {
        try {
            const comments = await Comment.find({ postId: req.params.postId })
                .populate('userId', 'name')

            res.send(comments);
        } catch (error) {
            console.error(error);
            res.status(500).send({message: 'Error al obtener comentarios', error});
        }
    },

    // actualizar comentario
    async update(req, res) {
        try {
            const { content } = req.body;
            if (!content) {
                return res.status(400).send({ message: 'El contenido es requerido' });
            }
            const comment = await Comment.findOneAndUpdate(
                { _id: req.params.id, userId: req.user._id },
                { text: content },
                { new: true }
            );
            if (!comment) return res.status(404).send({ message: 'Comentario no encontrado o no autorizado' });
            res.send({message: 'Comentario actualizado',comment});
        } catch (error) {
            console.error(error);
            res.status(500).send({message: 'Error al actualizar comentario', error});
        }
    },

    // eliminar like
    async delete(req, res) {
        try {
            const comment = await Comment.findOneAndDelete({
                _id: req.params.id,
                userId: req.user._id
            });

            if (!comment) {
                return res.status(404).send({ message: 'Comentario no encontrado o no autorizado' });
            }

            await Post.findByIdAndUpdate(comment.postId, {
                $pull: { comments: comment._id }
            });

            res.send({ message: 'Comentario eliminado correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Error al eliminar comentario',
                error
            });
        }
    },

    // dar likes
    async like(req, res) {
        try {
            const comment = await Comment.findByIdAndUpdate(
                req.params.id,
                { $addToSet: { likes: req.user._id } },
                { new: true }
            );

            if (!comment) {
                return res.status(404).send({ message: 'Comentario no encontrado' });
            }

            res.send({
                message: 'Like añadido al comentario',
                likes: comment.likes
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Error al dar like',
                error
            });
        }
    },

    // quitando likes
    async dislike(req, res) {
        try {
            const comment = await Comment.findByIdAndUpdate(
                req.params.id,
                { $pull: { likes: req.user._id } },
                { new: true }
            );

            if (!comment) {
                return res.status(404).send({ message: 'Comentario no encontrado' });
            }

            res.send({
                message: 'Like eliminado del comentario',
                likes: comment.likes
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Error al quitar like',
                error
            });
        }
    }
};

module.exports = CommentController;