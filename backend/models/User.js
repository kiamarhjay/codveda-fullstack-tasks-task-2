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
        role: {
            type: String,
            required: [true, 'Please select your domain'],
            enum: ['user', 'admin'],
            default: 'user',
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
UserSchema.pre ('save', async function () {
    if (!this.isModified('password')) 
         return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
});
UserSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', UserSchema);