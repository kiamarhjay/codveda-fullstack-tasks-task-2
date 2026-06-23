import React, { useState, useEffect } from "react";
import axios from 'axios';
import { io } from 'socket.io-client';

function Dashboard ({ token }) {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('Expense');
    const [category, setCategory] = useState('General');
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchExpenses = async() => {
        try {
            const response = await axios.get('http://localhost:4000/api/expenses', config);
            setExpenses(response.data);
        } catch (err) {
            setError('Could not fetch transaction data.');
            setTimeout(() => setError(''), 5000);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:4000');
        socket.on('budget_alert', (data) => {
            console.log("🔥 Received alert:", data);
            setAlertMessage(data.message);
            setTimeout(() => setAlertMessage(''), 5000);
        });
        return () => socket.disconnect();
    }, []);

    const handleAddExpenses = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post(
                'http://localhost:4000/api/expenses',
                { title, amount: Number(amount), type, category },
                config
            );
            setTitle('');
            setAmount('');
            fetchExpenses();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add item.');
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/expenses/${id}`, config);
            fetchExpenses(); 
        } catch (err) {
            setError('Could not delete the selected item.');
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="dashboard-grid">
            
            {/* 🛑 FLOATING ACTION/DELETE ERROR BANNER */}
            {error && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: '#ff4d4d', 
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    boxShadow: '0px 10px 25px rgba(0,0,0,0.25)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderLeft: '5px solid #280a02'
                }}>
                    <span>{error}</span>
                    <button
                        onClick={() => setError('')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '16px',
                            cursor: 'pointer',
                            paddingLeft: '10px',
                            fontWeight: 'bold'
                        }}>
                        ×
                    </button>
                </div>
            )}

            {/* 🔥 FLOATING REAL-TIME BUDGET SOCKET BANNER */}
            {alertMessage && (
                <div style={{
                    position: 'fixed',
                    top: '90px', // Shifted down slightly so they stack cleanly if both show up
                    right: '20px',
                    backgroundColor: '#ff4d4d', // Vibrant alert red
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    boxShadow: '0px 10px 25px rgba(0,0,0,0.25)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderLeft: '5px solid #b45309'
                }}>
                    <span>{alertMessage}</span>
                    <button
                        onClick={() => setAlertMessage('')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '16px',
                            cursor: 'pointer',
                            paddingLeft: '10px',
                            fontWeight: 'bold'
                        }}>
                        ×
                    </button>
                </div>
            )}

            {/* Entry Input Form Box */}
            <div className="dashboard-grid">
                <h3>Log New Transaction</h3>
                <form onSubmit={handleAddExpenses}>
                    <input
                        type="text"
                        placeholder="What did you pay for"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Account"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />

                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Expense">Expense (-)</option>
                        <option value="Income">Income (+)</option>
                    </select>

                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="General">General</option>
                        <option value="Food">Food & Drink</option>
                        <option value="Housing">Rent & Bills</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Salary">Salary/Revenue</option>
                    </select>

                    <button type="submit">Add Entry</button>
                </form>
            </div>

            <div className="card list-card">
                <h3>Transaction Ledger</h3>
                {expenses.length === 0 ? (
                    <p className="empty-text">No data recorded yet. Start tracking above!</p>
                ) : (
                    <ul className="expense-list">
                        {expenses.map((item) => (
                        <li key={item._id} className={`expense-item ${item.type.toLowerCase()}`}>
                            <div className="item-details">
                                <span className="item-title">{item.title}</span>
                                <span className="item-category">{item.category}</span>
                            </div>
                            <div className="item-numeric">
                                <span className="item-amount">
                                    {item?.type === 'Expense' ? '-' : '+'}${item.amount || 0}
                                </span>
                                <button className="delete-btn" onClick={() => handleDelete(item._id)}>❌</button>
                            </div>
                        </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );  
}

export default Dashboard;