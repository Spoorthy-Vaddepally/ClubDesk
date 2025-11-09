import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  redirectPath?: string;
  children: React.ReactNode;
}

const ProtectedRoute = ({ 
  redirectPath = '/login',
  children 
}: ProtectedRouteProps) => {
  const { user, loading, initialLoading } = useAuth();
  
  console.log('ProtectedRoute check:', { user, loading, initialLoading, redirectPath });
  
  // Show nothing while loading
  if (initialLoading) {
    console.log('Still initializing, showing loading indicator');
    return <div className="min-h-screen flex items-center justify-center">Initializing...</div>;
  }
  
  // Show loading indicator while fetching user data
  if (loading) {
    console.log('Still loading, showing loading indicator');
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // If there's no user, redirect to login
  if (!user) {
    console.log('No user found, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }
  
  // Check if user has the correct role for student routes
  if (redirectPath.includes('/student') && user.role !== 'student') {
    console.log('User role mismatch for student route, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  if (redirectPath.includes('/club') && user.role !== 'club_head') {
    console.log('User role mismatch for club route, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('Allowing access to protected route for user:', user);
  console.log('User role:', user.role);
  return <>{children}</>;
};

export default ProtectedRoute;