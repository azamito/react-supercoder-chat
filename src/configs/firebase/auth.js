import { Redirect } from 'react-router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';

import app from './';

// Firebase Auth
export const auth = getAuth(app);

// Registrasi
export const signUpNewUser = (email, password) => {
  const user = createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      return userCredential.user;
    })
    .catch((error) => {
      return error;
    })

  return user;
}

// Login
export const logInUser = (email, password) => {
  const user = signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      return userCredential.user;
    })
    .catch((error) => {
      return error;
    });

  return user;
}

// Logout
export const logOutUser = () => {
  if (window.confirm("Apakah anda yakin ingin keluar?")) {
    const user = signOut(auth).then(() => {
      return <Redirect to="/login" />
    }).catch((error) => {
      return error;
    });

    return user;
  } else {
    return false;
  }
}

// Lupa Password
export const resetPassword = (email, actionCodeSettings) => {
  const user = sendPasswordResetEmail(auth, email, actionCodeSettings)
    .then(() => {
      console.log('Email berhasil dikirim.');
    })
    .catch((error) => {
      return error;
    });

  return user;
}