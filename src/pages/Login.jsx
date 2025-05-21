// LoginPage.jsx
import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        navigate('/StudentDashboard');
        return;
      }

      const clubDoc = await getDoc(doc(db, 'clubs', uid));
      if (clubDoc.exists()) {
        navigate('/DashboardClubHead');
        return;
      }

      alert('No matching account found.');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', marginTop: 10 }} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: 'block', marginTop: 10 }} />
      <button onClick={handleLogin} style={{ marginTop: 10 }}>Login</button>
    </div>
  );
};

export default LoginPage;
