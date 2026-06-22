const mongoose = require ('mongoose');
const UserSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [6, 'Password must be atleast 6 characters'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', UserSchema);