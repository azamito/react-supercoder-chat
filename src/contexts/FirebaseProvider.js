import React, { createContext, useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { AppLoading } from '../components';
import { auth } from '../configs/firebase/auth';


// Firebase Context
const FirebaseContext = createContext();

export function useFirebase() {
  return useContext(FirebaseContext)
}

function FirebaseProvider({ children }) {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <AppLoading />
  }

  if (loading) {
    return <p>Error: {error.message}</p>
  }

  return (
    <FirebaseContext.Provider value={{ user }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export default FirebaseProvider;
