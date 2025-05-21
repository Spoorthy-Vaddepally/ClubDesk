import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ✅ Fetch additional user data from Firestore
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser({ uid: firebaseUser.uid, ...docSnap.data() });
        } else {
          setUser(firebaseUser); // fallback
        }
      } else {
        setUser(null);
      }

      setLoading(false); // ✅ Set loading to false once done
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
