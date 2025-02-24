import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './components/pages/HomePage';
import ProfilePage from './components/pages/ProfilePage';
import AboutPage from './components/pages/AboutPage';

import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';

function App() {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const showLoginModal = () => setIsLoginModalVisible(true);
  const hideLoginModal = () => setIsLoginModalVisible(false);

  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const showRegisterModal = () => setIsRegisterModalVisible(true);
  const hideRegisterModal = () => setIsRegisterModalVisible(false);

  return (
    <Router>
      <div>
        <Navbar showLoginModal={showLoginModal} showRegisterModal={showRegisterModal} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <LoginModal show={isLoginModalVisible} onHide={hideLoginModal} />
        <RegisterModal show={isRegisterModalVisible} onHide={hideRegisterModal} />
      </div>
    </Router>
  );
}

export default App;