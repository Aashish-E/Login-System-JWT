import React, { ReactNode } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface PublicRouteProps extends RouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, ...rest }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/profile',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PublicRoute;