import React, { useState } from 'react';
import API from '../services/Api';
import Swal from 'sweetalert2';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      const res = await API.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);

      Swal.fire({
        icon: 'success',
        title: 'Logged in successfully!',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate('/seats');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Please check your credentials.',
      });
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input
        className="auth-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="auth-button" onClick={handleLogin}>
        Login
      </button>
      <p>
        Don't have an account?{' '}
        <span className="auth-link" onClick={() => navigate('/signup')}>Sign Up</span>
      </p>
    </div>
  );
};

export default Login;

