import React, { useState } from 'react';
import { Mail, Lock, CheckCircle, User, Shield } from 'lucide-react';

const Login = ({ onLogin, t }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isForgotMode) {
      setIsResetSent(true);
      return;
    }

    if (isRegisterMode) {
      onLogin({ name, email });
      return;
    }

    if (email === 'panji@gmail.com' && password === 'admin') {
      onLogin({ name: 'Panji Sual', email });
    } else {
      alert("Email atau Password salah! Gunakan panji@gmail.com / admin.");
    }
  };

  const toggleForgotMode = (e) => {
    e.preventDefault();
    setIsForgotMode(!isForgotMode);
    setIsRegisterMode(false);
    setIsResetSent(false);
  };

  const toggleRegisterMode = (e) => {
    e.preventDefault();
    setIsRegisterMode(!isRegisterMode);
    setIsForgotMode(false);
    setIsResetSent(false);
  };

  if (isResetSent) {
    return (
      <div className="login-container">
        <div className="login-card success">
          <div className="success-icon-wrapper">
            <CheckCircle size={40} />
          </div>
          <h2>{t('lg_reset_success')}</h2>
          <p>{t('lg_reset_success_desc')}</p>
          <button className="login-btn" onClick={() => { setIsForgotMode(false); setIsResetSent(false); }}>
            {t('lg_back_login')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-header">
          <div className="login-logo-box">
            <Shield size={32} />
          </div>
          <h1>{isForgotMode ? 'Reset Password' : isRegisterMode ? 'Create Account' : 'JELAJAH.IN'}</h1>
          <p>{isForgotMode ? 'Enter your email to receive instructions' : isRegisterMode ? 'Join our community today' : 'Sign in to access your dashboard'}</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {isRegisterMode && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          {!isForgotMode && (
            <div className="form-group">
              <div className="label-row">
                <label>Password</label>
                {!isRegisterMode && <a href="#" onClick={toggleForgotMode} className="forgot-link">Forgot?</a>}
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          
          {!isForgotMode && !isRegisterMode && (
            <div className="login-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </div>
          )}
          
          <button type="submit" className="login-btn">
            {isForgotMode ? 'Send Reset Link' : isRegisterMode ? 'Create Account' : (
              <>
                <Lock size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            {isRegisterMode ? 'Already have an account?' : isForgotMode ? 'Remembered your password?' : "Don't have an account?"}
            <a href="#" onClick={isRegisterMode || isForgotMode ? (isForgotMode ? toggleForgotMode : toggleRegisterMode) : toggleRegisterMode}>
              {isRegisterMode || isForgotMode ? ' Log in' : ' Sign up'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


