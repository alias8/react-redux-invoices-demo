import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';

function Navigation() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      marginBottom: '20px',
      borderBottom: '2px solid #646cff'
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link
          to="/home"
          style={{
            color: '#646cff',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Home
        </Link>
        <Link
          to="/accounts"
          style={{
            color: '#646cff',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Accounts
        </Link>
        <Link
          to="/customers"
          style={{
            color: '#646cff',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Customers
        </Link>
      </div>
      <button
        onClick={handleLogout}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navigation;
