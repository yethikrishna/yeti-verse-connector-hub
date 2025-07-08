import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import linkedinHandler from '@/handlers/linkedinHandler';

const LinkedInCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
          // Process the authorization code with LinkedIn handler
          await linkedinHandler.handleCallback(code);
          // Redirect to connections page after successful authentication
          navigate('/connections');
        } else {
          console.error('Authorization code not found in URL parameters');
          navigate('/auth/error?message=Authorization code missing');
        }
      } catch (error) {
        console.error('LinkedIn authentication failed:', error);
        navigate('/auth/error?message=Authentication failed');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Processing LinkedIn Authentication...</h1>
        <p className="mt-4 text-gray-600">Please wait while we connect your LinkedIn account.</p>
      </div>
    </div>
  );
};

export default LinkedInCallback;