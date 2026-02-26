import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

/**
 * Wrapper pro chráněné routy.
 * @param {boolean} requireAdmin – pokud true, vyžaduje roli admin
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, role, authChecked } = useAuth();

  if (!authChecked) return null;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && role !== 'admin') return <Navigate to="/" />;

  return children;
}
