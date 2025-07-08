import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AuthError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('An unknown error occurred');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message) setErrorMessage(message);
  }, [location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-700 mb-6">{errorMessage}</p>
        <div className="flex space-x-4">
          <Button
            onClick={() => navigate('/connections')}
            className="flex-1"
          >
            Go to Connections
          </Button>
          <Button
            onClick={() => navigate('/auth/linkedin')}
            variant="secondary"
            className="flex-1"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthError;