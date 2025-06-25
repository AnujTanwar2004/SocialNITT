import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
    console.log("🔄 Redirecting to DAuth login...");
    window.location.href = 'http://10.1.17.129:5000/user/dauth/login';
  }

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