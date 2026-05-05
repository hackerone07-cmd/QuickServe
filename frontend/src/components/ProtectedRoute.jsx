import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate replace to="/" />;
  }

  return children;
}

export default ProtectedRoute;
