import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Profile: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  if (!isAuthenticated) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      {/* Display user details here */}
    </div>
  );
};

export default Profile;