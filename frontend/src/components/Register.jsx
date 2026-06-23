import React, { useState } from "react";
import axios from 'axios';

function Register ({ setToken, switchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:4000/api/auth/register', {
                name,
                email,
                password,
            });

            if (response.data.token) {
                setToken(response.data.token);
            }
        } catch (error) {
            setErrorMessage(
                error.response && error.response.data.message ? error.response.data.message : 'Registration failed. Try again.'
            );
        }
    };

    return (
        <div className="auth-card">
            <h2>Create Your Account</h2>
            <p>Get intermediate tracking insights in seconds</p>

            {errorMessage && <div className="error-banner">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type = "Text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) =>setEmail(e.target.value)}
                        required
                    />
                </div>

                 <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Choose secure password"
                        value={password}
                        onChange={(e) =>setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type ="submit" className="auth-submit-btn">Register Workspace</button>
            </form>

            <p className="auth-toggle-text">
                Already have an account? {' '}
                <span className="toggle-link" onClick={switchToLogin}>
                    Sign in here
                </span>
            </p>
        </div>
    );
 }

 export default Register;