import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { verifyUsername, signup } from '../api/SlotSyncApiService.js';
import './Login.css';
import './Signup.css';

export default function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [showQuestion1, setShowQuestion1] = useState(true);
    const [showQuestion2, setShowQuestion2] = useState(false);
    const [showQuestion3, setShowQuestion3] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showFailedMessage, setShowFailedMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    function handleNameChange(event) {
        setName(event.target.value);
    }

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function validateName() {
        if (name.trim() === '') {
            setErrorMessage('Name cannot be blank');
            return false;
        }
        return true;
    }

    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Invalid email address');
            return false;
        }
        if (email.length > 50) {
            setErrorMessage('Ensure email is under 50 characters');
            return false;
        }
        return true;
    }

    function validateUsername() {
        if (username.length < 4 || username.length > 20) {
            setErrorMessage('Username must be at least 4 characters');
            return false;
        }
        return true;
    }

    function validatePassword() {
        if (password.length < 8 || password.length > 120) {
            setErrorMessage('Password should be 8 to 120 characters long');
            return false;
        }
        return true;
    }

    async function handleNext() {
        if (showQuestion1) {
            if (validateName()) {
                setShowQuestion1(false);
                setShowQuestion2(true);
                setErrorMessage('');
            }
        } else if (showQuestion2) {
            if (validateEmail()) {
                setShowQuestion2(false);
                setShowQuestion3(true);
                setErrorMessage('');
            }
        } else if (showQuestion3) {
            if (validateUsername() && validatePassword()) {
                const response = await verifyUsername(username);
                if (response.data.data !== null) {
                    setShowFailedMessage(true);
                } else {
                    const signupRequest = {
                        username: username,
                        password: password,
                        email: email,
                        name: name,
                        role: ["user"]
                    };
                    await signup(signupRequest);
                    setShowQuestion3(false);
                    setShowFailedMessage(false);
                    setShowSuccessMessage(true);
                }
                setErrorMessage('');
            }
        } else {
            navigate(`/login`);
        }
    }

    return (
        <div className="login-container-signup">
            <div className="login-box-signup">
                <div className="login-form-signup">
                    <span>Create Account</span>
                    <div>
                        <div className="form-field-signup">
                            {
                                showQuestion1
                                &&
                                <div className="question-input">
                                    <div className="question">What's your name?</div>
                                    <input type="text" id="name" name="name" placeholder="Name" value={name} onChange={handleNameChange} />
                                </div>
                            }
                            {
                                showQuestion2
                                &&
                                <div className="question-input">
                                    <div className="question">Enter your email</div>
                                    <input type="text" id="email" name="email" placeholder="Email" value={email} onChange={handleEmailChange} />
                                </div>
                            }
                            {
                                showQuestion3
                                &&
                                <div className="question-input">
                                    <div className="question">Set up your credentials</div>
                                    <span>
                                        <input type="text" id="username" name="username" placeholder="Username" value={username} onChange={handleUsernameChange} />
                                        <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                                    </span>
                                </div>
                            }
                            {
                                showSuccessMessage
                                &&
                                <div className="question-input">
                                    <div className="question">Successfully Created</div>
                                </div>
                            }
                        </div>
                        <button type="button" className="login-button-next" onClick={handleNext}>Next</button>
                        {showFailedMessage && <div className="failedMessage">Username already exists, Please try again</div>}
                        {errorMessage && <div className="failedMessage">{errorMessage}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
