const User = require('../models/User');

const FollowController = {
    //seguir a un usuario
    async follow(req, res) {
        try {
            const userId = req.user._id;
            const userToFollowId = req.params.id;

            if (userId.toString() === userToFollowId.toString()) {
                return res.status(400).send({ message: 'No puedes seguirte a ti mismo' });
            }
            const userToFollow = await User.findById(userToFollowId);
            if (!userToFollow) {
                return res.status(404).send({ message: 'Usuario no encontrado' });
            }

            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { following: userToFollowId } },
                { new: true }
            );
            await User.findByIdAndUpdate(
                userToFollowId,
                { $addToSet: { followers: userId } },
                { new: true }
            );

            res.send({ message: `Ahora sigues a ${userToFollow.name}` });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al seguir al usuario', error });
        }
    },

    // quitar follow
    async unfollow(req, res) {
        try {
            const userId = req.user._id;
            const userToUnfollowId = req.params.id;

            if (userId.toString() === userToUnfollowId.toString()) {
                return res.status(400).send({ message: 'No puedes dejar de seguirte a ti mismo' });
            }

            const userToUnfollow = await User.findById(userToUnfollowId);
            if (!userToUnfollow) {
                return res.status(404).send({ message: 'Usuario no encontrado' });
            }
            await User.findByIdAndUpdate(
                userId,
                { $pull: { following: userToUnfollowId } },
                { new: true }
            );

            await User.findByIdAndUpdate(
                userToUnfollowId,
                { $pull: { followers: userId } },
                { new: true }
            );

            res.send({ message: `Has dejado de seguir a ${userToUnfollow.name}` });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al dejar de seguir al usuario', error });
        }
    }
};

module.exports = FollowController;