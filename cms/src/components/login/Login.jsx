import React, { useState } from 'react';
import { Lock, CheckCircle, User, Eye, EyeOff } from 'lucide-react';
import logoJelajah from '../../assets/logo-jelajah.png';

const Login = ({ onLogin, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const clearError = () => {
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // WAJIB supaya tidak reload
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // misal API kirim token
        localStorage.setItem('token', data.data.access_token);
        localStorage.setItem('nama', data.data.user.name);
        // panggil function dari parent
        onLogin(data);
      } else {
        setError(data.message || "Email atau kata sandi yang Anda masukkan salah.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan koneksi ke server. Silakan coba kembali.");
    } finally {
      setIsLoading(false);
    }
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
          <button
            className="portal-btn"
            onClick={() => {
              setIsForgotMode(false);
              setIsResetSent(false);
            }}
          >
            KEMBALI KE LOGIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      {/* Premium Shake Animation Keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-6px); }
          30%, 60%, 90% { transform: translateX(6px); }
        }
        .shake-error {
          animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="login-card">
        {/* Logo Section */}
        <div className="login-logo-container">
          <img src={logoJelajah} alt="JELAJAH.IN" className="login-logo-img" />
        </div>
        
        {/* Title */}
        <div className="portal-title">{isForgotMode ? t('lg_forgot_title') : 'ADMIN'}</div>
        
        {/* Elegant Shake Error Alert */}
        {error && (
          <div
            className="shake-error"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '12px',
              color: '#ef4444',
              fontSize: '13.5px',
              fontWeight: 500,
              lineHeight: '1.4',
              marginBottom: '20px',
              textAlign: 'left'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {/* Form */}
        <form className="portal-form" onSubmit={handleSubmit}>
          <div className="portal-input-group">
            <input
              type="text"
              className="portal-input"
              placeholder="Username atau Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={clearError}
              required
            />
            <User size={18} className="portal-input-icon" />
          </div>
          
          {!isForgotMode && (
            <div className="portal-input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="portal-input"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={clearError}
                required
              />
              <Lock size={18} className="portal-input-icon" />
              <div className="portal-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          )}
          
          <div className="portal-form-footer">
            {!isForgotMode ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgotMode(true);
                }}
                className="portal-forgot-link"
              >
                {t('lg_forgot')}
              </a>
            ) : (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgotMode(false);
                }}
                className="portal-forgot-link"
              >
                {t('lg_back_login')}
              </a>
            )}
          </div>
          
          <button
            type="submit"
            className="portal-btn"
            disabled={isLoading}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    width: '18px',
                    height: '18px',
                    color: 'white',
                    animation: 'spin 0.8s linear infinite'
                  }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    style={{ opacity: 0.25 }}
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Memproses...</span>
              </>
            ) : (
              isForgotMode ? t('lg_forgot_btn') : 'MASUK'
            )}
          </button>
        </form>
        
        {/* Footer */}
        <div className="portal-footer">
          Hak Cipta &copy; 2024 JELAJAH.IN. <br />
          Akses Terbatas.
        </div>
      </div>
    </div>
  );
};

export default Login;