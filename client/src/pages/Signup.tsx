import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IonContent, IonPage, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { useAppDispatch } from '../redux/hooks';
import { registerUser } from '../redux/userSlice';

const Signup: React.FC = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      dispatch(registerUser(values));
    },
  });

  return (
    <IonPage>
      <IonContent>
        <form onSubmit={formik.handleSubmit}>
          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput
              id="username"
              name="username"
              type="text"
              onIonChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
          </IonItem>
          {formik.touched.username && formik.errors.username ? (
            <div>{formik.errors.username}</div>
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
          <IonButton type="submit">Sign Up</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
