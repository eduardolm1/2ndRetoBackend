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
    }
};

module.exports = CommentController;