const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');
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
UserSchema.pre ('save', async function (next) {
    if (!this.isModified('password')) 
        { return next(); }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
UserSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', UserSchema);