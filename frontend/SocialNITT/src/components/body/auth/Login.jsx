import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

function Login() {
  const { isLogged } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Redirect already logged-in users to hero page
  useEffect(() => {
    console.log("🔍 Login component - isLogged:", isLogged);
    if (isLogged) {
      console.log("✅ User already logged in, redirecting to hero...");
      navigate('/');
    }
  }, [isLogged, navigate]);

  const handleDAuthLogin = () => {
  const authUrl = `${import.meta.env.VITE_API_URL}/user/dauth/login`;
  window.location.href = authUrl;
   };

  // Don't render login form if user is already logged in
  if (isLogged) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="login_page">
      <h2>Login</h2>

      <button onClick={handleDAuthLogin} className="dauth-login-btn">
        Login with DAuth
      </button>

      <p style={{ marginTop: "20px" }}>
        You must have a Delta DAuth account to access this site.
      </p>
    </div>
  );
}

export default Login;