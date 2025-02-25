import React, { useState } from 'react';
import './DeleteAccountModal.css';

const DeleteAccountModal = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const verifyPassword = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/verifyPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password verification failed.');
      }

      return true; // Password is correct
    } catch (err) {
      setMessage(err.message);
      return false; // Password is incorrect
    }
  };

  const handleDelete = async () => {
    setMessage('');

    const isPasswordValid = await verifyPassword();
    if (!isPasswordValid) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/delete?userId=${localStorage.getItem('userId')}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        localStorage.clear(); // Clear all local storage
        window.location.href = '/'; // Redirect to home page
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to delete account. Please try again.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again later.');
      console.error('Delete account error:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Confirm Account Deletion</h2>
        {message && <p className="message">{message}</p>}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="delete-btn" onClick={handleDelete}>Delete Account</button>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
