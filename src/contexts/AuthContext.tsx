import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
export type Role = 'student' | 'club_head';

// Input for club head extra data (excluding common fields)
export interface ClubData {
  clubName: string;
  establishedYear?: string;
  domain?: string;
  motto?: string;
  description?: string;
  contact?: string;
  instagram?: string;
  linkedin?: string;
  logoURL?: string;
}

// Input for student extra data (excluding common fields)
export interface StudentData {
  department: string;
  year: string;
  collegeId: string;
  avatar?: string;
}

// Union type for extra data depending on role
export type RegisterExtraData = ClubData | StudentData;

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  role: Role;
  clubName?: string;
  username?: string;
  establishedYear?: string;
  domain?: string;
  motto?: string;
  description?: string;
  contact?: string;
  instagram?: string;
  linkedin?: string;
  logoURL?: string;
  department?: string;
  collegeId?: string;
  year?: string;
}

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;

  // Optional student fields
  department?: string;
  year?: string;
  collegeId?: string;

  // Optional club head fields
  clubName?: string;
  domain?: string;
  motto?: string;
  description?: string;
  contact?: string;
  instagram?: string;
  linkedin?: string;
  logoURL?: string;
  establishedYear?: string;

  [key: string]: any; // allow extra fields if necessary
}

interface AuthContextType {
  user: AppUser | null;

  // Modified register to take params object with typed extraData
  register: (
    params: RegisterParams
  ) => Promise<UserCredential>;

  login: (email: string, password: string) => Promise<Role>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Debug logging function
const debugLog = (message: string, data?: any) => {
  console.log(`[Auth Debug] ${message}`, data ? data : '');
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch user data from Firestore based on uid and set in state
  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    debugLog('Fetching user data for:', { uid: firebaseUser.uid, email: firebaseUser.email });
    
    try {
      const uid = firebaseUser.uid;
      
      // Check users collection (for students)
      try {
        debugLog('Checking users collection for UID:', uid);
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          debugLog('Found user data in users collection:', data);
          const userData: AppUser = {
            uid,
            name: data.name || '',
            email: data.email || firebaseUser.email || '',
            role: 'student',
            avatar: data.avatar || '',
            department: data.department || '',
            year: data.year || '',
            collegeId: data.collegeId || '',
            ...data
          };
          setUser(userData);
          debugLog('Set user state for student:', userData);
          return 'student';
        } else {
          debugLog('No user document found in users collection for UID:', uid);
        }
      } catch (err: any) {
        debugLog('Error fetching student data:', err);
        if (err.code === 'permission-denied') {
          debugLog('Permission denied when accessing student data');
          // Don't throw error here, continue with other checks
        }
      }

      // Check clubs collection (for club heads)
      try {
        debugLog('Checking clubs collection for UID:', uid);
        const clubDoc = await getDoc(doc(db, 'clubs', uid));
        if (clubDoc.exists()) {
          const data = clubDoc.data();
          debugLog('Found club data in clubs collection:', data);
          const clubData: AppUser = {
            uid,
            name: data.name || '',
            email: data.email || firebaseUser.email || '',
            role: 'club_head',
            avatar: data.logoURL || '',
            clubName: data.clubName || '',
            domain: data.domain || '',
            motto: data.motto || '',
            description: data.description || '',
            contact: data.contact || '',
            instagram: data.instagram || '',
            linkedin: data.linkedin || '',
            logoURL: data.logoURL || '',
            establishedYear: data.establishedYear || '',
            ...data
          };
          setUser(clubData);
          debugLog('Set user state for club head:', clubData);
          return 'club_head';
        } else {
          debugLog('No club document found in clubs collection for UID:', uid);
        }
      } catch (err: any) {
        debugLog('Error fetching club data:', err);
        if (err.code === 'permission-denied') {
          debugLog('Permission denied when accessing club data');
          // Don't throw error here, continue with other checks
        }
      }

      // If no doc found, this might be a newly registered user
      // Let's check if we can get the email from Firebase user
      if (firebaseUser.email) {
        debugLog('Checking by email since UID lookup failed:', firebaseUser.email);
        try {
          // Try to find user by email in both collections
          debugLog('Checking users collection by email:', firebaseUser.email);
          const usersByEmail = await getDoc(doc(db, 'users', firebaseUser.email));
          if (usersByEmail.exists()) {
            const data = usersByEmail.data();
            debugLog('Found user data by email in users collection:', data);
            const userData: AppUser = {
              uid: firebaseUser.uid,
              name: data.name || '',
              email: firebaseUser.email,
              role: 'student',
              avatar: data.avatar || '',
              department: data.department || '',
              year: data.year || '',
              collegeId: data.collegeId || '',
              ...data
            };
            setUser(userData);
            debugLog('Set user state for student (by email):', userData);
            return 'student';
          }
        } catch (err: any) {
          debugLog('Error fetching student data by email:', err);
          if (err.code === 'permission-denied') {
            debugLog('Permission denied when accessing student data by email');
            // Don't throw error here, continue with other checks
          }
        }

        try {
          debugLog('Checking clubs collection by email:', firebaseUser.email);
          const clubsByEmail = await getDoc(doc(db, 'clubs', firebaseUser.email));
          if (clubsByEmail.exists()) {
            const data = clubsByEmail.data();
            debugLog('Found club data by email in clubs collection:', data);
            const clubData: AppUser = {
              uid: firebaseUser.uid,
              name: data.name || '',
              email: firebaseUser.email,
              role: 'club_head',
              avatar: data.logoURL || '',
              clubName: data.clubName || '',
              domain: data.domain || '',
              motto: data.motto || '',
              description: data.description || '',
              contact: data.contact || '',
              instagram: data.instagram || '',
              linkedin: data.linkedin || '',
              logoURL: data.logoURL || '',
              establishedYear: data.establishedYear || '',
              ...data
            };
            setUser(clubData);
            debugLog('Set user state for club head (by email):', clubData);
            return 'club_head';
          }
        } catch (err: any) {
          debugLog('Error fetching club data by email:', err);
          if (err.code === 'permission-denied') {
            debugLog('Permission denied when accessing club data by email');
            // Don't throw error here, continue with other checks
          }
        }
      }

      // If no doc found, clear user
      debugLog('No user data found for UID:', uid);
      setUser(null);
      return null;
    } catch (err) {
      debugLog('Error in fetchUserData:', err);
      setUser(null);
      return null; // Don't throw error, just return null
    }
  };

  // On mount: listen to auth state change
  useEffect(() => {
    debugLog('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      debugLog('Auth state changed:', { 
        hasUser: !!firebaseUser, 
        uid: firebaseUser?.uid, 
        email: firebaseUser?.email 
      });
      
      if (firebaseUser) {
        await fetchUserData(firebaseUser);
      } else {
        debugLog('No authenticated user, clearing user state');
        setUser(null);
      }
      setInitialLoading(false);
    });
    return () => {
      debugLog('Unsubscribing from auth state listener');
      unsubscribe();
    };
  }, []);

 const register = async (params: RegisterParams) => {
  const { name, email, password, role, ...extraData } = params;
  debugLog('Starting registration process:', { name, email, role, extraData });
  
  setLoading(true);
  setError(null);
  try {
    debugLog('Creating user with email and password');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    debugLog('User created:', { uid: firebaseUser.uid, email: firebaseUser.email });
    
    if (!firebaseUser) {
      const errorMsg = 'User not created';
      debugLog(errorMsg);
      throw new Error(errorMsg);
    }

    if (role === 'student') {
      debugLog('Creating student document in users collection');
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          name,
          email,
          role,
          ...extraData,
          createdAt: serverTimestamp()
        });
        debugLog('Student document created successfully');
      } catch (err: any) {
        debugLog('Error creating student document:', err);
        if (err.code === 'permission-denied') {
          // In development, we can create a minimal user object in state
          debugLog('Permission denied, creating minimal user state for development');
          const userData: AppUser = {
            uid: firebaseUser.uid,
            name,
            email,
            role: 'student',
            ...extraData
          };
          setUser(userData);
          debugLog('Set minimal user state for student:', userData);
        } else {
          throw err; // Re-throw non-permission errors
        }
      }
    } else if (role === 'club_head') {
      debugLog('Creating club document in clubs collection');
      try {
        await setDoc(doc(db, 'clubs', firebaseUser.uid), {
          name,
          email,
          role,
          ...extraData,
          createdAt: serverTimestamp()
        });
        debugLog('Club document created successfully');
      } catch (err: any) {
        debugLog('Error creating club document:', err);
        if (err.code === 'permission-denied') {
          // In development, we can create a minimal user object in state
          debugLog('Permission denied, creating minimal user state for development');
          const clubData: AppUser = {
            uid: firebaseUser.uid,
            name,
            email,
            role: 'club_head',
            ...extraData
          };
          setUser(clubData);
          debugLog('Set minimal user state for club head:', clubData);
        } else {
          throw err; // Re-throw non-permission errors
        }
      }
    }

    debugLog('Fetching user data after registration');
    await fetchUserData(firebaseUser); // update user state
    debugLog('Registration completed successfully');
    return userCredential;
  } catch (err: any) {
    debugLog('Registration error occurred:', err);
    // Handle specific Firebase errors
    if (err.code === 'permission-denied') {
      const errorMsg = 'Insufficient permissions to register. The Firestore security rules may need to be updated. Please contact support or try again later.';
      debugLog(errorMsg);
      setError(errorMsg);
    } else if (err.code === 'auth/email-already-in-use') {
      const errorMsg = 'An account with this email already exists.';
      debugLog(errorMsg);
      setError(errorMsg);
    } else if (err.code === 'auth/invalid-email') {
      const errorMsg = 'The email address is invalid.';
      debugLog(errorMsg);
      setError(errorMsg);
    } else if (err.code === 'auth/operation-not-allowed') {
      const errorMsg = 'Email/password accounts are not enabled.';
      debugLog(errorMsg);
      setError(errorMsg);
    } else if (err.code === 'auth/weak-password') {
      const errorMsg = 'The password is too weak. Please use a stronger password.';
      debugLog(errorMsg);
      setError(errorMsg);
    } else {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      debugLog('Unknown error:', errorMsg);
      setError(errorMsg);
    }
    throw err;
  } finally {
    setLoading(false);
  }
};


  const login = async (
    email: string,
    password: string
  ): Promise<Role> => {
    debugLog('Starting login process:', { email });
    setLoading(true);
    setError(null);
    try {
      debugLog('Signing in with email and password');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      debugLog('Login successful:', { uid: userCredential.user.uid, email: userCredential.user.email });
      
      const role = await fetchUserData(userCredential.user);
      if (!role) {
        // Even if we can't fetch user data due to permissions, we can still allow login
        // and create a minimal user object
        debugLog('User role not found, creating minimal user state');
        const userData: AppUser = {
          uid: userCredential.user.uid,
          name: 'Unknown User',
          email: userCredential.user.email || email,
          role: 'student' // Default to student role
        };
        setUser(userData);
        debugLog('Set minimal user state for login:', userData);
        return 'student'; // Return default role
      }
      debugLog('Login completed successfully, role:', role);
      return role;
    } catch (err: any) {
      debugLog('Login error occurred:', err);
      // Handle specific Firebase errors
      if (err.code === 'permission-denied') {
        const errorMsg = 'Insufficient permissions to login. Please contact support.';
        debugLog(errorMsg);
        setError(errorMsg);
      } else if (err.code === 'auth/user-not-found') {
        const errorMsg = 'No account found with this email.';
        debugLog(errorMsg);
        setError(errorMsg);
      } else if (err.code === 'auth/wrong-password') {
        const errorMsg = 'Incorrect password.';
        debugLog(errorMsg);
        setError(errorMsg);
      } else if (err.code === 'auth/invalid-email') {
        const errorMsg = 'The email address is invalid.';
        debugLog(errorMsg);
        setError(errorMsg);
      } else if (err.code === 'auth/user-disabled') {
        const errorMsg = 'This account has been disabled.';
        debugLog(errorMsg);
        setError(errorMsg);
      } else {
        const errorMsg = err.message || 'Login failed. Please try again.';
        debugLog('Unknown error:', errorMsg);
        setError(errorMsg);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    debugLog('Starting logout process');
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      debugLog('Logout successful');
      setUser(null);
    } catch (err: any) {
      debugLog('Logout error occurred:', err);
      const errorMsg = err.message || 'Logout failed. Please try again.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    debugLog('App is in initial loading state');
    return <>Loading...</>; // or a spinner component, until user state is resolved
  }

  debugLog('Rendering AuthProvider with user state:', user);
  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};