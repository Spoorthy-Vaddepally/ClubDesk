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
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
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
  bannerURL?: string;
  clubPhone?: string;
  clubEmail?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  address?: string;
}

// Input for student extra data (excluding common fields)
export interface StudentData {
  department: string;
  year: string;
  collegeId: string;
  phone?: string;
  bio?: string;
  interests?: string[];
  skills?: string[];
  avatar?: string;
}

// Union type for extra data depending on role
export type RegisterExtraData = ClubData | StudentData;

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  role: Role;
  // Common optional fields
  phone?: string;
  bio?: string;
  interests?: string[];
  skills?: string[];
  avatar?: string;
  // Student specific fields
  department?: string;
  collegeId?: string;
  year?: string;
  // Club head specific fields
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
  bannerURL?: string;
  clubPhone?: string;
  clubEmail?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  address?: string;
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
  phone?: string;
  bio?: string;
  interests?: string[];
  skills?: string[];

  // Optional club head fields
  clubName?: string;
  domain?: string;
  motto?: string;
  description?: string;
  contact?: string;
  instagram?: string;
  linkedin?: string;
  logoURL?: string;
  bannerURL?: string;
  establishedYear?: string;
  clubPhone?: string;
  clubEmail?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  address?: string;

  [key: string]: any; // allow extra fields if necessary
}

interface AuthContextType {
  user: AppUser | null;
  register: (params: RegisterParams) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<Role>;
  logout: () => Promise<void>;
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  updateUserProfile?: (updatedData: Partial<AppUser>) => void;
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

  // Function to update user profile data
  const updateUserProfile = (updatedData: Partial<AppUser>) => {
    if (user) {
      setUser({
        ...user,
        ...updatedData
      });
    }
  };

  // Fetch user data from Firestore based on uid and set in state
  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<Role> => {
    debugLog('Fetching user data for:', { uid: firebaseUser.uid, email: firebaseUser.email });
    console.log('Fetching user data for:', { uid: firebaseUser.uid, email: firebaseUser.email });
    
    try {
      const uid = firebaseUser.uid;
      
      // Check both collections to determine the correct role
      let userRole: Role | null = null;
      let userData: AppUser | null = null;
      
      // Check clubs collection first (for club heads)
      try {
        debugLog('Checking clubs collection for UID:', uid);
        console.log('Checking clubs collection for UID:', uid);
        const clubDoc = await getDoc(doc(db, 'clubs', uid));
        console.log('Club document exists:', clubDoc.exists());
        console.log('Club document data:', clubDoc.exists() ? clubDoc.data() : 'No document');
        if (clubDoc.exists()) {
          const data = clubDoc.data();
          debugLog('Found club data in clubs collection:', data);
          console.log('Found club data in clubs collection:', data);
          console.log('Club data keys:', Object.keys(data));
          console.log('Club data role:', data.role);
          userData = {
            uid,
            name: data.name || '',
            email: data.email || firebaseUser.email || '',
            role: 'club_head',
            avatar: data.logoURL || '',
            clubName: data.clubName || data.name || '',
            domain: data.domain || '',
            motto: data.motto || '',
            description: data.description || '',
            contact: data.contact || '',
            instagram: data.instagram || '',
            linkedin: data.linkedin || '',
            logoURL: data.logoURL || '',
            bannerURL: data.bannerURL || '',
            establishedYear: data.establishedYear || '',
            clubPhone: data.clubPhone || '',
            clubEmail: data.clubEmail || '',
            website: data.website || '',
            facebook: data.facebook || '',
            twitter: data.twitter || '',
            address: data.address || '',
            ...data
          };
          userRole = 'club_head';
          console.log('About to set user state for club head:', userData);
          setUser(userData);
          debugLog('Set user state for club head:', userData);
          console.log('Set user state for club head:', userData);
          console.log('Returning role: club_head');
          return 'club_head';
        } else {
          console.log('No club document found for UID:', uid);
        }
      } catch (err: any) {
        debugLog('Error fetching club data:', err);
        console.error('Error fetching club data:', err);
        if (err.code === 'permission-denied') {
          debugLog('Permission denied when accessing club data');
          console.log('Permission denied when accessing club data');
          // Check if we have club data in memory from registration
          if (user && user.role === 'club_head' && user.uid === uid) {
            console.log('Using club head data from memory');
            return 'club_head';
          }
        }
      }
      
      // Check users collection (for students) only if not a club head
      if (!userRole) {
        try {
          debugLog('Checking users collection for UID:', uid);
          console.log('Checking users collection for UID:', uid);
          const userDoc = await getDoc(doc(db, 'users', uid));
          console.log('User document exists:', userDoc.exists());
          console.log('User document data:', userDoc.exists() ? userDoc.data() : 'No document');
          if (userDoc.exists()) {
            const data = userDoc.data();
            debugLog('Found user data in users collection:', data);
            console.log('Found user data in users collection:', data);
            console.log('User data keys:', Object.keys(data));
            console.log('User data role:', data.role);
            
            // Determine role from the document
            const documentRole = data.role || 'student';
            
            userData = {
              uid,
              name: data.name || '',
              email: data.email || firebaseUser.email || '',
              role: documentRole,
              avatar: data.avatar || '',
              department: data.department || '',
              year: data.year || '',
              collegeId: data.collegeId || '',
              phone: data.phone || '',
              bio: data.bio || '',
              interests: data.interests || [],
              skills: data.skills || [],
              ...data
            };
            userRole = documentRole;
            console.log('About to set user state for student:', userData);
            setUser(userData);
            debugLog('Set user state:', userData);
            console.log('Set user state:', userData);
            console.log('Returning role:', userRole);
            return userRole as Role;
          } else {
            debugLog('No user document found in users collection for UID:', uid);
            console.log('No user document found in users collection for UID:', uid);
            
            // NEW: Implement email-based search fallback as per memory specification
            if (firebaseUser.email) {
              debugLog('Trying email-based search for user data');
              console.log('Trying email-based search for user data with email:', firebaseUser.email);
              
              try {
                // Search for user by email in users collection
                const usersRef = collection(db, 'users');
                const emailQuery = query(usersRef, where('email', '==', firebaseUser.email));
                const emailSnapshot = await getDocs(emailQuery);
                
                if (!emailSnapshot.empty) {
                  const emailDoc = emailSnapshot.docs[0];
                  const data = emailDoc.data();
                  debugLog('Found user data by email search:', data);
                  console.log('Found user data by email search:', data);
                  
                  const documentRole = data.role || 'student';
                  
                  userData = {
                    uid: emailDoc.id, // Use the document ID as UID
                    name: data.name || '',
                    email: data.email || firebaseUser.email || '',
                    role: documentRole,
                    avatar: data.avatar || '',
                    department: data.department || '',
                    year: data.year || '',
                    collegeId: data.collegeId || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    interests: data.interests || [],
                    skills: data.skills || [],
                    ...data
                  };
                  userRole = documentRole;
                  console.log('About to set user state for student (email search):', userData);
                  setUser(userData);
                  debugLog('Set user state (email search):', userData);
                  console.log('Set user state (email search):', userData);
                  console.log('Returning role (email search):', userRole);
                  return userRole as Role;
                } else {
                  console.log('No user found by email search');
                }
              } catch (emailSearchError) {
                console.error('Error during email-based search:', emailSearchError);
              }
            }
            
            // Check if we have student data in memory from registration
            if (user && user.role === 'student' && user.uid === uid) {
              console.log('Using student data from memory');
              return 'student';
            }
            
            // Create a default profile for the student
            try {
              const defaultUserData: AppUser = {
                uid,
                name: firebaseUser.displayName || firebaseUser.email || 'Unknown User',
                email: firebaseUser.email || '',
                role: 'student',
                avatar: '',
                bannerURL: '',
                department: '',
                year: '',
                collegeId: '',
                phone: '',
                bio: '',
                interests: [],
                skills: []
              };
              await setDoc(doc(db, 'users', uid), defaultUserData);
              console.log('About to set default user state for student:', defaultUserData);
              setUser(defaultUserData);
              debugLog('Created and set default user state for student:', defaultUserData);
              console.log('Created and set default user state for student:', defaultUserData);
              console.log('Returning role: student');
              return 'student';
            } catch (createError) {
              debugLog('Error creating default student profile:', createError);
              console.error('Error creating default student profile:', createError);
              // Still set user state even if we can't create the document
              const defaultUserData: AppUser = {
                uid,
                name: firebaseUser.displayName || firebaseUser.email || 'Unknown User',
                email: firebaseUser.email || '',
                role: 'student',
                avatar: '',
                bannerURL: '',
                department: '',
                year: '',
                collegeId: '',
                phone: '',
                bio: '',
                interests: [],
                skills: []
              };
              console.log('About to set default user state without creating document:', defaultUserData);
              setUser(defaultUserData);
              debugLog('Set default user state without creating document:', defaultUserData);
              console.log('Set default user state without creating document:', defaultUserData);
              console.log('Returning role: student');
              return 'student';
            }
          }
        } catch (err: any) {
          debugLog('Error fetching student data:', err);
          console.error('Error fetching student data:', err);
          if (err.code === 'permission-denied') {
            debugLog('Permission denied when accessing student data');
            console.log('Permission denied when accessing student data');
            // Still set user state even if we can't access the document
            const defaultUserData: AppUser = {
              uid,
              name: firebaseUser.displayName || firebaseUser.email || 'Unknown User',
              email: firebaseUser.email || '',
              role: 'student',
              avatar: '',
              bannerURL: ''
            };
            console.log('About to set default user state due to permission denied:', defaultUserData);
            setUser(defaultUserData);
            debugLog('Set default user state due to permission denied:', defaultUserData);
            console.log('Set default user state due to permission denied:', defaultUserData);
            console.log('Returning role: student');
            return 'student';
          }
        }
      }
      
      // If no doc found and not already set, create a default student profile
      if (!userRole) {
        debugLog('No user data found, creating default student profile');
        console.log('No user data found, creating default student profile');
        const defaultUserData: AppUser = {
          uid,
          name: firebaseUser.displayName || firebaseUser.email || 'Unknown User',
          email: firebaseUser.email || '',
          role: 'student',
          avatar: '',
          bannerURL: ''
        };
        console.log('About to set default user state:', defaultUserData);
        setUser(defaultUserData);
        debugLog('Set default user state:', defaultUserData);
        console.log('Set default user state:', defaultUserData);
        console.log('Returning role: student');
        return 'student';
      }
      
      console.log('Final returning role:', userRole);
      console.log('Final returning role type:', typeof userRole);
      return userRole as Role; // Ensure we always return a valid Role
    } catch (err) {
      debugLog('Error in fetchUserData:', err);
      console.error('Error in fetchUserData:', err);
      // Even if we can't fetch user data, we should still allow the user to be logged in
      const defaultUserData: AppUser = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email || 'Unknown User',
        email: firebaseUser.email || '',
        role: 'student',
        avatar: ''
      };
      console.log('About to set default user state due to error:', defaultUserData);
      setUser(defaultUserData);
      debugLog('Set default user state due to error:', defaultUserData);
      console.log('Set default user state due to error:', defaultUserData);
      console.log('Returning role due to error: student');
      return 'student';
    }
  };

  // On mount: listen to auth state change
  useEffect(() => {
    debugLog('Setting up auth state listener');
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      debugLog('Auth state changed:', { 
        hasUser: !!firebaseUser, 
        uid: firebaseUser?.uid, 
        email: firebaseUser?.email 
      });
      console.log('Auth state changed:', { 
        hasUser: !!firebaseUser, 
        uid: firebaseUser?.uid, 
        email: firebaseUser?.email 
      });
      
      if (firebaseUser) {
        console.log('Fetching user data for authenticated user');
        const role = await fetchUserData(firebaseUser);
        console.log('fetchUserData returned role in useEffect:', role);
        console.log('fetchUserData returned role type in useEffect:', typeof role);
      } else {
        debugLog('No authenticated user, clearing user state');
        console.log('No authenticated user, clearing user state');
        setUser(null);
      }
      // Only set initial loading to false after we've checked the auth state
      setInitialLoading(false);
    });
    return () => {
      debugLog('Unsubscribing from auth state listener');
      console.log('Unsubscribing from auth state listener');
      unsubscribe();
    };
  }, []);

  const register = async (params: RegisterParams) => {
    const { name, email, password, role, ...extraData } = params;
    debugLog('Starting registration process:', { name, email, role, extraData });
    console.log('Starting registration process:', { name, email, role, extraData });
    console.log('Registration role type:', typeof role);
    
    setLoading(true);
    setError(null);
    try {
      debugLog('Creating user with email and password');
      console.log('Creating user with email and password');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      debugLog('User created:', { uid: firebaseUser.uid, email: firebaseUser.email });
      console.log('User created:', { uid: firebaseUser.uid, email: firebaseUser.email });
      
      if (!firebaseUser) {
        const errorMsg = 'User not created';
        debugLog(errorMsg);
        console.log(errorMsg);
        throw new Error(errorMsg);
      }

      if (role === 'student') {
        debugLog('Creating student document in users collection');
        console.log('Creating student document in users collection');
        try {
          // Prepare student data with only provided fields
          const studentData: any = {
            name,
            email,
            role,
            createdAt: serverTimestamp()
          };
          
          // Add required fields
          if (extraData.department) studentData.department = extraData.department;
          if (extraData.year) studentData.year = extraData.year;
          if (extraData.collegeId) studentData.collegeId = extraData.collegeId;
          
          // Add optional fields only if they have values
          if (extraData.phone) studentData.phone = extraData.phone;
          if (extraData.bio) studentData.bio = extraData.bio;
          if (extraData.interests && extraData.interests.length > 0) studentData.interests = extraData.interests;
          if (extraData.skills && extraData.skills.length > 0) studentData.skills = extraData.skills;
          if (extraData.avatar) studentData.avatar = extraData.avatar;
          
          console.log('Student data to be saved:', studentData);
          await setDoc(doc(db, 'users', firebaseUser.uid), studentData);
          debugLog('Student document created successfully');
          console.log('Student document created successfully');
          
          // Set user state immediately for fallback
          const userData: AppUser = {
            uid: firebaseUser.uid,
            name,
            email,
            role: 'student',
            department: extraData.department || '',
            year: extraData.year || '',
            collegeId: extraData.collegeId || '',
            phone: extraData.phone || '',
            bio: extraData.bio || '',
            interests: extraData.interests || [],
            skills: extraData.skills || [],
            avatar: extraData.avatar || ''
          };
          setUser(userData);
        } catch (err: any) {
          debugLog('Error creating student document:', err);
          console.log('Error creating student document:', err);
          if (err.code === 'permission-denied') {
            debugLog('Permission denied, creating minimal user state for development');
            console.log('Permission denied, creating minimal user state for development');
            const userData: AppUser = {
              uid: firebaseUser.uid,
              name,
              email,
              role: 'student',
              department: extraData.department || '',
              year: extraData.year || '',
              collegeId: extraData.collegeId || '',
              phone: extraData.phone || '',
              bio: extraData.bio || '',
              interests: extraData.interests || [],
              skills: extraData.skills || [],
              avatar: extraData.avatar || ''
            };
            setUser(userData);
            debugLog('Set minimal user state for student:', userData);
            console.log('Set minimal user state for student:', userData);
          } else {
            throw err; // Re-throw non-permission errors
          }
        }
      } else if (role === 'club_head') {
        debugLog('Creating club document in clubs collection');
        console.log('Creating club document in clubs collection');
        console.log('Role is club_head, creating club document');
        try {
          // Prepare club data with only provided fields
          const clubData: any = {
            name,
            email,
            role: 'club_head',
            createdAt: serverTimestamp()
          };
          
          // Add required fields
          if (extraData.clubName) clubData.clubName = extraData.clubName;
          if (extraData.establishedYear) clubData.establishedYear = extraData.establishedYear;
          if (extraData.domain) clubData.domain = extraData.domain;
          if (extraData.motto) clubData.motto = extraData.motto;
          if (extraData.description) clubData.description = extraData.description;
          
          // Add optional fields only if they have values
          if (extraData.contact) clubData.contact = extraData.contact;
          if (extraData.instagram) clubData.instagram = extraData.instagram;
          if (extraData.linkedin) clubData.linkedin = extraData.linkedin;
          if (extraData.logoURL) clubData.logoURL = extraData.logoURL;
          if (extraData.bannerURL) clubData.bannerURL = extraData.bannerURL;
          if (extraData.clubPhone) clubData.clubPhone = extraData.clubPhone;
          if (extraData.clubEmail) clubData.clubEmail = extraData.clubEmail;
          if (extraData.website) clubData.website = extraData.website;
          if (extraData.facebook) clubData.facebook = extraData.facebook;
          if (extraData.twitter) clubData.twitter = extraData.twitter;
          if (extraData.address) clubData.address = extraData.address;
          if (extraData.avatar) clubData.avatar = extraData.avatar;
          
          console.log('Club data to be saved:', clubData);
          await setDoc(doc(db, 'clubs', firebaseUser.uid), clubData);
          debugLog('Club document created successfully');
          console.log('Club document created successfully');
          
          // Set user state immediately for fallback
          const clubUserData: AppUser = {
            uid: firebaseUser.uid,
            name,
            email,
            role: 'club_head',
            clubName: extraData.clubName || '',
            domain: extraData.domain || '',
            motto: extraData.motto || '',
            description: extraData.description || '',
            contact: extraData.contact || '',
            instagram: extraData.instagram || '',
            linkedin: extraData.linkedin || '',
            logoURL: extraData.logoURL || '',
            bannerURL: extraData.bannerURL || '',
            establishedYear: extraData.establishedYear || '',
            clubPhone: extraData.clubPhone || '',
            clubEmail: extraData.clubEmail || '',
            website: extraData.website || '',
            facebook: extraData.facebook || '',
            twitter: extraData.twitter || '',
            address: extraData.address || '',
            avatar: extraData.avatar || ''
          };
          setUser(clubUserData);
        } catch (err: any) {
          debugLog('Error creating club document:', err);
          console.log('Error creating club document:', err);
          if (err.code === 'permission-denied') {
            debugLog('Permission denied, creating minimal user state for development');
            console.log('Permission denied, creating minimal user state for development');
            const clubData: AppUser = {
              uid: firebaseUser.uid,
              name,
              email,
              role: 'club_head',
              clubName: extraData.clubName || '',
              domain: extraData.domain || '',
              motto: extraData.motto || '',
              description: extraData.description || '',
              contact: extraData.contact || '',
              instagram: extraData.instagram || '',
              linkedin: extraData.linkedin || '',
              logoURL: extraData.logoURL || '',
              bannerURL: extraData.bannerURL || '',
              establishedYear: extraData.establishedYear || '',
              clubPhone: extraData.clubPhone || '',
              clubEmail: extraData.clubEmail || '',
              website: extraData.website || '',
              facebook: extraData.facebook || '',
              twitter: extraData.twitter || '',
              address: extraData.address || '',
              avatar: extraData.avatar || ''
            };
            setUser(clubData);
            debugLog('Set minimal user state for club head:', clubData);
            console.log('Set minimal user state for club head:', clubData);
          } else {
            throw err; // Re-throw non-permission errors
          }
        }
      }

      debugLog('Registration completed successfully');
      console.log('Registration completed successfully');
      return userCredential;
    } catch (err: any) {
      debugLog('Registration error occurred:', err);
      console.log('Registration error occurred:', err);
      // Handle specific Firebase errors
      if (err.code === 'permission-denied') {
        const errorMsg = 'Insufficient permissions to register. The Firestore security rules may need to be updated. Please contact support or try again later.';
        debugLog(errorMsg);
        console.log(errorMsg);
        setError(errorMsg);
      } else if (err.code === 'auth/email-already-in-use') {
        const errorMsg = 'An account with this email already exists.';
        debugLog(errorMsg);
        console.log(errorMsg);
        setError(errorMsg);
      } else if (err.code === 'auth/invalid-email') {
        const errorMsg = 'The email address is invalid.';
        debugLog(errorMsg);
        console.log(errorMsg);
        setError(errorMsg);
      } else if (err.code === 'auth/operation-not-allowed') {
        const errorMsg = 'Email/password accounts are not enabled.';
        debugLog(errorMsg);
        console.log(errorMsg);
        setError(errorMsg);
      } else if (err.code === 'auth/weak-password') {
        const errorMsg = 'The password is too weak. Please use a stronger password.';
        debugLog(errorMsg);
        console.log(errorMsg);
        setError(errorMsg);
      } else {
        const errorMsg = err.message || 'Registration failed. Please try again.';
        debugLog('Unknown error:', errorMsg);
        console.log('Unknown error:', errorMsg);
        setError(errorMsg);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<Role> => {
    debugLog('Starting login process:', { email });
    console.log('Starting login process:', { email });
    setLoading(true);
    setError(null);
    try {
      debugLog('Signing in with email and password');
      console.log('Signing in with email and password');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      debugLog('Login successful:', { uid: userCredential.user.uid, email: userCredential.user.email });
      console.log('Firebase login successful:', { uid: userCredential.user.uid, email: userCredential.user.email });
      
      const role = await fetchUserData(userCredential.user);
      console.log('fetchUserData returned role:', role);
      console.log('fetchUserData returned role type:', typeof role);
      
      // Additional debugging
      console.log('About to return role from login function:', role);
      
      debugLog('Login completed successfully, role:', role);
      console.log('Login completed successfully, role:', role);
      console.log('Login completed successfully, role type:', typeof role);
      return role;
    } catch (err: any) {
      console.error('Login error:', err);
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
      } else if (err.code === 'auth/too-many-requests') {
        const errorMsg = 'Too many failed login attempts. Please try again later.';
        debugLog(errorMsg);
        setError(errorMsg);
      } else if (err.code === 'auth/network-request-failed') {
        const errorMsg = 'Network error. Please check your connection and try again.';
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

  // Show loading indicator while initializing auth state
  if (initialLoading) {
    debugLog('App is in initial loading state');
    return <div>Loading...</div>; // or a spinner component, until user state is resolved
  }

  debugLog('Rendering AuthProvider with user state:', user);
  console.log('AuthProvider rendering with user:', user);
  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading, initialLoading, error, updateUserProfile }}>
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