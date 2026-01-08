import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import Navigation, { ViewHeight } from './Navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ViewHeight>
      <Navigation />
      {children}
    </ViewHeight>
  );
}

export default ProtectedRoute;