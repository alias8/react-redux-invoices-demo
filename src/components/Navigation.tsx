import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';

function Navigation() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const username = useAppSelector((state) => state.auth.username);

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {username && (
          <span style={{
            color: '#888',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            Logged in as: {username}
          </span>
        )}
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
      </div>
    </nav>
  );
}

export const ViewHeight = ({ children }: {
    children: React.ReactNode;
}) => {
    return (<div           style={{
        height: '100vh',
    }}>{ children }</div>)
}

export default Navigation;
