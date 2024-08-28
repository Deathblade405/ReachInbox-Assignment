import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import ConfirmationModal from '../components/Modal';

const Login = () => {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        const redirectUrl = 'https://deathblade405.github.io/ReachInbox-Assignment/'; // or your deployed app URL

        const googleLoginUrl = `https://hiring.reachinbox.xyz/api/v1/auth/google-login?redirect_to=${redirectUrl}`;

        window.open(googleLoginUrl, '_self');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/ReachInbox-Assignment');
    };

    React.useEffect(() => {
        // Extract the token from the URL after redirection
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            // Store the token in localStorage
            localStorage.setItem('authToken', token);

            // Clear the URL to avoid showing the token in the address bar
            window.history.replaceState({}, document.title, "/ReachInbox-Assignment");

            // Redirect to OneBoxScreen page
            navigate('/ReachInbox-Assignment/onebox');
        }
    }, [navigate]);

    return (
        <div className="container">
            <div className="header">
                <span className="person-icon" onClick={() => setShowConfirmationModal(true)}>
                    👤
                </span>
            </div>
            <h2>REACHINBOX</h2>
            <h1>Login</h1>
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
            {showConfirmationModal && (
                <ConfirmationModal
                    message="Are you sure you want to logout?"
                    onConfirm={handleLogout}
                    onCancel={() => setShowConfirmationModal(false)}
                />
            )}
        </div>
    );
};

export default Login;
