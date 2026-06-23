const Expense = require('../models/Expense');

const getExpense = async (req,res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json ({ message: error.message });
    }
};

const createExpense = async (req,res) => {
    const { title, amount, type, category, date } = req.body;
    try {
        const expense = await Expense.create({
            user: req.user._id,
            title,
            amount,
            type,
            category,
            date,
        });
        const io = req.app.get('io');
        if (type=== 'Expense' && Number(amount) >=500){
            io.emit('budget_alert', {
                message:`⚠️High Spending Alert! $${amount} spent on "${title}".`
            });
        }
    
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteExpense = async (req,res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense entry not found'});
        }
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this resource'});
        }
        await expense.deleteOne();
        res.json({ message: 'Expense removed successfully'});
    } catch (error) {
        res.status(500).json ({ message: error.message });
    }
};

module.exports = {
    getExpense,
    createExpense,
    deleteExpense,
};