const express = require('express');
const router = express.Router();
const { getExpense, createExpense, deleteExpense } = require('../controllers/expenseController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getExpense)
    .post(protect, createExpense);

router.route('/:id')
    .delete(protect, authorizeRoles('admin'), deleteExpense);

module.exports = router; 