import { useNavigate } from 'react-router-dom';
import LoginForm from './../components/shared/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const handleLoginSuccess = () => navigate('/profile');

  return (
    <div className="login-page">
      <h1>Login</h1>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Login;