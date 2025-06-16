const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const UserSchema  = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        age: Number,
        role: String,
        tokens: [],
        ordersIds: [{ type: ObjectId, ref: 'Order' }]

    }, { timestamps: true }
)

UserSchema.methods.toJSON = function () {
    const user = this._doc;
    delete user.tokens;
    delete user.password;
    return user;
}