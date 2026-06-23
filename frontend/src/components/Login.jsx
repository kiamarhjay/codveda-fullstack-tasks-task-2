import React, { useState } from "react";
import axios from 'axios';

function Login ({ setToken, switchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', {
                email,
                password,
            });

            if (response.data.token) {
                setToken(response.data.token);
            }
        } catch (error) {
            setErrorMessage(
                error.response && error.response.data.message
                ? error.response.data.message 
                : 'Something went wrong. Try again.'
            );
        }
    };

    return (
        <div className="auth-card">
            <h2>Welcome Back</h2>
            <p>Log in manage your daily tracker</p>
            {errorMessage && <div className="error-banner">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="auth-submit-btn">Sign In</button>
            </form>

            <p className="auth-toggle-text">
                Don't have an account?{' '}
                <span className="toggle-link" onClick={switchToRegister}>
                    Register here
                </span>
            </p>
        </div>
    );
}

export default Login;


