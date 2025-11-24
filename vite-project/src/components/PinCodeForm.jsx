import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { pinAPI } from '../services/api';
import '../styles/PinCodeForm.css';

const PinCodeForm = () => {
  const navigate = useNavigate();
  const { verifyPin, logout } = useContext(AuthContext);

  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inputRefs = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle input change
  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');
    setSuccess('');

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all 6 digits are filled
    if (value && index === 5) {
      const fullPin = newPin.join('');
      if (fullPin.length === 6) {
        handleSubmit(fullPin);
      }
    }
  };

  // Handle keydown
  const handleKeyDown = (index, e) => {
    // Backspace handling
    if (e.key === 'Backspace') {
      if (!pin[index] && index > 0) {
        // If current input is empty, focus previous
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newPin = [...pin];
        newPin[index] = '';
        setPin(newPin);
      }
    }

    // Arrow key navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Only allow 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newPin = pastedData.split('');
      setPin(newPin);
      setError('');
      setSuccess('');

      // Focus last input
      inputRefs.current[5]?.focus();

      // Auto submit
      setTimeout(() => {
        handleSubmit(pastedData);
      }, 100);
    }
  };

  // Handle submit
  const handleSubmit = async (pinCode = null) => {
    const fullPin = pinCode || pin.join('');

    if (fullPin.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await pinAPI.verifyPin(fullPin);

      if (response.success) {
        setSuccess('PIN verified successfully! Redirecting...');
        verifyPin();

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError(response.message || 'Invalid PIN');
        setPin(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'PIN verification failed');
      setPin(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Handle manual submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  // Handle back/logout
  const handleBack = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="pin-container">
      <div className="pin-card">
        <div className="pin-header">
          <h1>PIN Verification</h1>
          <p>Enter your 6-digit PIN code</p>
        </div>

        <div className="pin-info">
          <p>For testing, use PIN: <strong>123456</strong></p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleFormSubmit}>
          <div className="pin-inputs">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`pin-input ${digit ? 'filled' : ''}`}
                disabled={loading}
                autoComplete="off"
              />
            ))}
          </div>

          <button
            type="submit"
            className="verify-button"
            disabled={loading || pin.join('').length !== 6}
          >
            {loading ? (
              <>
                Verifying
                <span className="loading-spinner"></span>
              </>
            ) : (
              'Verify PIN'
            )}
          </button>

          <button
            type="button"
            className="back-button"
            onClick={handleBack}
            disabled={loading}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinCodeForm;
