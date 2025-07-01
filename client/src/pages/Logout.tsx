import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logoutUser } from '../redux/userSlice';

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    history.push('/login');
  };

  return (
    <div>
      <h1>Logout</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;