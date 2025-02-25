import React, { useState } from 'react';
import './ProfilePage.css';
import DeleteAccountModal from '../modals/DeleteAccountModal'; // Import the modal component

const ProfilePage = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State to control the modal visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ 
          userId: localStorage.getItem('userId'), // Assuming userId is stored in localStorage
          username, 
          email, 
          password 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken); // Update the access token
        localStorage.setItem('username', data.user.username); // Update the username in local storage
        localStorage.setItem('email', data.user.email); // Update the email in local storage
        setUsername(data.user.username); // Update the state with the new username
        setEmail(data.user.email); // Update the state with the new email
        setPassword(''); // Clear the password field
        setMessage('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to update profile. Please try again.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again later.');
      console.error('Profile update error:', err);
    }
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalVisible(true); // Show the delete account modal
  };

  return (
    <div className="profile-page">
      <h2>Profile Page</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Save Changes</button>
      </form>
      <div className="spacer"></div> {/* Spacer element */}
      <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
      {isDeleteModalVisible && <DeleteAccountModal onClose={() => setIsDeleteModalVisible(false)} />}
    </div>
  );
};

export default ProfilePage;