import React, { createContext, useContext } from 'react';
import { Redirect } from 'react-router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import AppLoading from '../AppLoading';
import app from '../../config/firebase';
export const auth = getAuth(app);
const Context = createContext(auth);

// Mendaftarkan user baru
export const signUpNewUser = (auth, email, password) => {
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

// Keluar dari halaman chat
export const logOutUser = (auth) => {
  const user = signOut(auth).then(() => {
    return <Redirect to="/login" />
  }).catch((error) => {
    return error;
  });

  return user;
}

// Firebase Context
export function useFirebase() {
  return useContext(Context)
}

function FirebaseProvider({ children }) {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <AppLoading />
  }

  return (
    <Context.Provider value={{ user }}>
      {children}
    </Context.Provider>
  )
}

export default FirebaseProvider;
