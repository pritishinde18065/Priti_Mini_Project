import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import Loader from './components/Loader'; 

function App() {
  const { isSignedIn, isLoaded, user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && (location.pathname === '/' || location.pathname.startsWith('/auth'))) {
        navigate('/dashboard', { replace: true });
      } else if (!isSignedIn && location.pathname !== '/' && !location.pathname.startsWith('/auth')) {
        navigate('/', { replace: true });
      }
    }
  }, []);

  if (!isLoaded) {
    return <Loader />; 
  }

  return <Outlet />;
}

export default App;
