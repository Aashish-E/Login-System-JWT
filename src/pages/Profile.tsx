import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <p>Welcome, {user.username}</p>
      <p>Email: {user.email}</p>
      <button onClick={logout} className="logout-button">Logout</button>
    </div>
  );
};

export default Profile;