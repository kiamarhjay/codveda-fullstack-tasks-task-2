const mongoose = require('mongoose');
const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true,'Please add a title'],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
    },
    type: {
        type: String,
        required: [true, 'Please specify if this is an income or expense'],
        enum: ['Income', 'Expense'],
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        default: 'General',
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
        default: Date.now,
    },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Expense', ExpenseSchema);