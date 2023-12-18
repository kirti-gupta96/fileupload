const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: Buffer,
        required: true
    },
    role: {
        type: String
    },
    deletedAt: {
        type: Date
    }
},
    {
        timestamps: true,
        collection: 'users',
    }
);

const Users = mongoose.model("users", UsersSchema);

module.exports = Users;