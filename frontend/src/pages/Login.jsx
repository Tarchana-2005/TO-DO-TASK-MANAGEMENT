import "./Login.css";

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Task Manager</h1>
        <p className="login-subtitle">Plan your day, stay productive.</p>
        <button className="google-btn" onClick={handleGoogleLogin}>
           Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
