import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUsername, setPassword, login } from '../store/authSlice';
import { useState } from 'react';

function LoginPage() {
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.auth.username);
  const password = useAppSelector((state) => state.auth.password);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`/api/users?username=${username}&password=${password}`);
      const users = await response.json();

      if (users.length > 0) {
        const user = users[0];
        dispatch(login({ id: user.id, username: user.username }));
        navigate('/home');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Login</h1>
      {error && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => dispatch(setUsername(e.target.value))}
            required
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
            required
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;