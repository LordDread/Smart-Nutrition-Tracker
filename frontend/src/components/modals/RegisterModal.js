import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from 'prop-types';
import './RegisterModal.css';

const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/signup`;

const RegisterModal = ({ show, onHide }) => {
  const [data, setData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const { data: res } = await axios.post(url, {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      localStorage.setItem('token', res.token); 
      
      onHide();

      navigate("/loginPage");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onHide}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onHide}>X</button>
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" style={{ fontWeight: "bold", textDecoration: "none" }}>Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={data.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
            <small className="text-muted">We just might sell your data</small>
          </div>
          <div className="form-group">
            <label htmlFor="email" style={{ fontWeight: "bold", textDecoration: "none" }}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter Email Please"
              required
            />
            <small className="text-muted">We just might sell your data</small>
          </div>
          <div className="form-group">
            <label htmlFor="password" style={{ fontWeight: "bold", textDecoration: "none" }}>Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" style={{ fontWeight: "bold", textDecoration: "none" }}>Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
          </div>
          {error && (
            <div style={{fontWeight: "bold", textDecoration: "none" }} className="pt-3">
              {error}
            </div>
          )}
          <button type="submit" className="btn btn-primary mt-2">Register</button>
        </form>
      </div>
    </div>
  );
};

RegisterModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default RegisterModal;