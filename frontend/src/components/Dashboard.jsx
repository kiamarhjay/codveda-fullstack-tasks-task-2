import React, { useState, useEffect } from "react";
import axios from 'axios';
import { io } from 'socket.io-client';

function Dashboard ({ token}) {
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
        try{
            const response = await axios.get('http://localhost:4000/api/expenses', config);
            setExpenses(response.data);
        } catch (err) {
            setError('Could not fetch transaction data.');
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(()=>{
        const socket = io('http://localhost:4000');
        socket.on('budget_alert', (data)=> {
            console.log("🔥Recieved alert:", data);
            setAlertMessage(data.message);
            setTimeout(() => setAlertMessage(''), 5000);
        });
        return() => socket.disconnect();
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
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/expenses/${id}`, config);
            fetchExpenses(); 
        } catch (err) {
            setError('Could not delete the selected item.');
        }
    };

    return (
        <div className="dashboard-grid">
            {error && <div className="error-banner">{error}</div>}

            {/*Entry Input Form Box*/}
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
                        <option value="Entertainment">Entertaiment</option>
                        <option value="Salary">Salary/Revenue</option>
                    </select>

                    <button type="submit">Add Entry</button>
                </form>
            </div>
            {alertMessage &&(
                <div style={{
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
                }}>
                    {alertMessage}
                </div>
            )}

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
