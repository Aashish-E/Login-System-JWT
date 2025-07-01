import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { setAuthState, validateToken, logoutUser } from './redux/userSlice';
import App from './App';
import './theme/variables.css';

const initializeAuthState = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    store.dispatch(setAuthState({ token }));
    store.dispatch(validateToken());
  }
};

initializeAuthState();

const AuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userToken') {
        const token = localStorage.getItem('userToken');
        if (!token) {
          dispatch(logoutUser());
        } else {
          dispatch(setAuthState({ token }));
          dispatch(validateToken());
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  return null;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthListener />
      <App />
    </Provider>
  </React.StrictMode>
);
