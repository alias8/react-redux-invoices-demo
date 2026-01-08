import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import Navigation, { ViewContainer } from './Navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ViewContainer>
      <Navigation />
      {children}
    </ViewContainer>
  );
}

export default ProtectedRoute;
