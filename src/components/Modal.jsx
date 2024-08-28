// src/components/ConfirmationModal.js

import React from 'react';
import '../styles/modal.css'; // Create this CSS file for styling the confirmation modal

const Modal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirmation-modal-overlay">
            <div className="confirmation-modal-content">
                <h2>{message}</h2>
                <div className="confirmation-modal-buttons">
                    <button onClick={onConfirm} className="confirm-button">Yes</button>
                    <button onClick={onCancel} className="cancel-button">No</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
