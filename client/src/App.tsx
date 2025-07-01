import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import Profile from './pages/uProfile';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

setupIonicReact();

const App: React.FC = () => (
  <Provider store={store}>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" exact={true}>
            <Home />
          </Route>
          <PublicRoute path="/login" exact={true}>
            <Login />
          </PublicRoute>
          <PublicRoute path="/signup" exact={true}>
            <Signup />
          </PublicRoute>
          <Route path="/logout" exact={true}>
            <Logout />
          </Route>
          <PrivateRoute path="/profile" exact={true}>
            <Profile />
          </PrivateRoute>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </Provider>
);

export default App;