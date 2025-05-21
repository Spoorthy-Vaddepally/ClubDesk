// RegisterPage.jsx
import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const RegisterPage = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({});

  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      if (role === 'student') {
        const studentData = {
          uid,
          email,
          role,
          username: formData.username,
          registrationNumber: formData.registrationNumber,
          class: formData.class,
          year: Number(formData.year),
          collegeName: formData.collegeName,
        };
        await setDoc(doc(db, 'users', uid), studentData);
      } else {
        const clubData = {
          uid,
          email,
          role,
          name: formData.name,
          description: formData.description,
          createdAt: new Date(),
        };
        await setDoc(doc(db, 'clubs', uid), clubData);
      }

      alert('Registration successful! You can now login.');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <label>
        <input type="radio" value="student" checked={role === 'student'} onChange={() => setRole('student')} /> Student
      </label>
      <label style={{ marginLeft: 20 }}>
        <input type="radio" value="club" checked={role === 'club'} onChange={() => setRole('club')} /> Club
      </label>

      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', marginTop: 10 }} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: 'block', marginTop: 10 }} />

      {role === 'student' ? (
        <>
          <input placeholder="Username" onChange={(e) => setFormData({ ...formData, username: e.target.value })} style={{ display: 'block', marginTop: 10 }} />
          <input placeholder="Registration Number" onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} style={{ display: 'block', marginTop: 10 }} />
          <input placeholder="Class" onChange={(e) => setFormData({ ...formData, class: e.target.value })} style={{ display: 'block', marginTop: 10 }} />
          <input placeholder="Year" onChange={(e) => setFormData({ ...formData, year: e.target.value })} style={{ display: 'block', marginTop: 10 }} />
          <input placeholder="College Name" onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })} style={{ display: 'block', marginTop: 10 }} />
        </>
      ) : (
        <>
          <input placeholder="Club Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ display: 'block', marginTop: 10 }} />
          <input placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ display: 'block', marginTop: 10 }} />
        </>
      )}

      <button onClick={handleRegister} style={{ marginTop: 10 }}>Register</button>
    </div>
  );
};

export default RegisterPage;

