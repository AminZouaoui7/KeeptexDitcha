import React from 'react';
import '../App.css'; // Assuming App.css will contain the splash screen styles
import { ReactComponent as Logo } from '../logo.svg';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="splash-logo-container">
        <Logo className="splash-logo" />
        <div className="loading-circle"></div>
      </div>
      <span className="splash-text">KEEP TEX</span>
    </div>
  );
};

export default SplashScreen;