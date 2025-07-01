import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IonContent, IonPage, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginUser, logoutUser } from '../redux/userSlice';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <IonPage>
      <IonContent>
        {!isAuthenticated ? (
          <form onSubmit={formik.handleSubmit}>
            <IonItem>
              <IonLabel position="floating">email or mobile number</IonLabel>
              <IonInput
                id="identifier"
                name="identifier"
                type="text"
                onIonChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.identifier}
              />
            </IonItem>
            {formik.touched.identifier && formik.errors.identifier ? (
              <div>{formik.errors.identifier}</div>
            ) : null}
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                id="password"
                name="password"
                type="password"
                onIonChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </IonItem>
            {formik.touched.password && formik.errors.password ? (
              <div>{formik.errors.password}</div>
            ) : null}
            <IonButton type="submit">Login</IonButton>
          </form>
        ) : (
          <IonButton onClick={handleLogout}>Logout</IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Login;
