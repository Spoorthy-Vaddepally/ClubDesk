import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db, auth } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterExampleDataPage = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  // Example clubs data with simple names
  const exampleClubs = [
    {
      name: "clubexample1",
      email: "clubexample1@example.com",
      password: "password123",
      clubName: "clubexample1",
      domain: "Technology",
      motto: "Innovate and Create",
      description: "A club focused on technology innovation and coding workshops.",
      establishedYear: "2020",
      contact: "clubexample1@university.edu",
      clubPhone: "+1234567890",
      clubEmail: "clubexample1@university.edu",
      website: "https://clubexample1.university.edu",
      instagram: "@clubexample1",
      linkedin: "clubexample1",
      logoURL: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop",
      bannerURL: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=300&fit=crop",
    },
    {
      name: "clubexample2",
      email: "clubexample2@example.com",
      password: "password123",
      clubName: "clubexample2",
      domain: "Arts",
      motto: "Express and Explore",
      description: "A club dedicated to arts, culture, and creative expression.",
      establishedYear: "2018",
      contact: "clubexample2@university.edu",
      clubPhone: "+1234567891",
      clubEmail: "clubexample2@university.edu",
      website: "https://clubexample2.university.edu",
      instagram: "@clubexample2",
      linkedin: "clubexample2",
      logoURL: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop",
      bannerURL: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=300&fit=crop",
    },
    {
      name: "clubexample3",
      email: "clubexample3@example.com",
      password: "password123",
      clubName: "clubexample3",
      domain: "Sports",
      motto: "Train and Compete",
      description: "A club promoting sports and physical fitness among students.",
      establishedYear: "2019",
      contact: "clubexample3@university.edu",
      clubPhone: "+1234567892",
      clubEmail: "clubexample3@university.edu",
      website: "https://clubexample3.university.edu",
      instagram: "@clubexample3",
      linkedin: "clubexample3",
      logoURL: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop",
      bannerURL: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=300&fit=crop",
    }
  ];

  // Example students data with simple names
  const exampleStudents = [
    {
      name: "student1",
      email: "student1@example.com",
      password: "password123",
      department: "Computer Science",
      year: "3rd Year",
      collegeId: "STU001",
      phone: "+1234567893",
      bio: "Passionate about technology and innovation.",
      interests: ["Coding", "AI", "Robotics"],
      skills: ["JavaScript", "Python", "React"],
    },
    {
      name: "student2",
      email: "student2@example.com",
      password: "password123",
      department: "Fine Arts",
      year: "2nd Year",
      collegeId: "STU002",
      phone: "+1234567894",
      bio: "Creative artist with a passion for visual expression.",
      interests: ["Painting", "Sculpture", "Photography"],
      skills: ["Adobe Photoshop", "Illustrator", "Drawing"],
    },
    {
      name: "student3",
      email: "student3@example.com",
      password: "password123",
      department: "Physical Education",
      year: "4th Year",
      collegeId: "STU003",
      phone: "+1234567895",
      bio: "Sports enthusiast and fitness advocate.",
      interests: ["Basketball", "Swimming", "Fitness"],
      skills: ["Team Leadership", "Coaching", "Athletics"],
    }
  ];

  const registerClubs = async () => {
    setLoading(true);
    setStatus('Registering clubs and creating events...');
    
    try {
      for (const club of exampleClubs) {
        setStatus(`Registering ${club.clubName}...`);
        
        // Check if club already exists
        const clubsQuery = query(collection(db, 'clubs'), where('email', '==', club.email));
        const clubsSnapshot = await getDocs(clubsQuery);
        
        let clubUid = null;
        
        if (clubsSnapshot.empty) {
          // Create auth user
          const userCredential = await createUserWithEmailAndPassword(auth, club.email, club.password);
          clubUid = userCredential.user.uid;
          
          // Create club document
          const clubData = {
            name: club.name,
            email: club.email,
            role: 'club_head',
            clubName: club.clubName,
            domain: club.domain,
            motto: club.motto,
            description: club.description,
            establishedYear: club.establishedYear,
            contact: club.contact,
            clubPhone: club.clubPhone,
            clubEmail: club.clubEmail,
            website: club.website,
            instagram: club.instagram,
            linkedin: club.linkedin,
            logoURL: club.logoURL,
            bannerURL: club.bannerURL,
            createdAt: new Date()
          };
          
          await setDoc(doc(db, 'clubs', clubUid), clubData);
          setStatus(`Registered ${club.clubName} successfully!`);
        } else {
          setStatus(`${club.clubName} already exists, creating events, awards, certificates, and EB members...`);
          // Get existing club UID
          clubUid = clubsSnapshot.docs[0].id;
        }
        
        // Create two events for the club if we have a valid UID
        if (clubUid) {
          try {
            setStatus(`Creating events for ${club.clubName}...`);
            
            // Event 1
            const event1Data = {
              name: `${club.clubName} Monthly Meeting`,
              description: `Monthly meeting for ${club.clubName} members to discuss upcoming activities and projects.`,
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
              time: "18:00",
              location: "Main Campus Building, Room 101",
              capacity: 50,
              registered: 0,
              clubId: clubUid,
              clubName: club.clubName,
              createdAt: new Date(),
              isPublic: true,
              type: "Meeting"
            };
            
            await setDoc(doc(collection(db, 'clubs', clubUid, 'events'), `event1`), event1Data);
            
            // Event 2
            const event2Data = {
              name: `${club.clubName} Workshop`,
              description: `Hands-on workshop organized by ${club.clubName} for members and interested students.`,
              date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
              time: "15:00",
              location: "Innovation Center, Hall A",
              capacity: 30,
              registered: 0,
              clubId: clubUid,
              clubName: club.clubName,
              createdAt: new Date(),
              isPublic: true,
              type: "Workshop"
            };
            
            await setDoc(doc(collection(db, 'clubs', clubUid, 'events'), `event2`), event2Data);
            
            setStatus(`Created 2 events for ${club.clubName}!`);
            
            // Create sample awards for the club
            const award1Data = {
              name: "Best Innovation Award",
              recipient: "ebmember1",
              date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
              category: "Achievement",
              description: "Awarded for outstanding innovation in club activities",
              image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop",
              recipientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
              clubId: clubUid,
              clubName: club.clubName,
              createdAt: new Date()
            };
            
            await setDoc(doc(collection(db, 'awards'), `${clubUid}_award1`), award1Data);
            
            const award2Data = {
              name: "Community Service Excellence",
              recipient: "ebmember2",
              date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
              category: "Engagement",
              description: "Recognition for exceptional community service contributions",
              image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=400&h=300&fit=crop",
              recipientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
              clubId: clubUid,
              clubName: club.clubName,
              createdAt: new Date()
            };
            
            await setDoc(doc(collection(db, 'awards'), `${clubUid}_award2`), award2Data);
            
            // Create sample certificates for the club
            const certificate1Data = {
              name: "Leadership Certificate",
              club: club.clubName,
              issueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
              category: "Achievement",
              description: "Certificate of completion for leadership training program",
              image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop",
              userId: "exampleUserId123",
              clubId: clubUid,
              clubName: club.clubName,
              createdAt: new Date()
            };
            
            await setDoc(doc(collection(db, 'certificates'), `${clubUid}_cert1`), certificate1Data);
            
            const certificate2Data = {
              name: "Event Participation Certificate",
              club: club.clubName,
              issueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
              category: "Participation",
              description: "Certificate for active participation in club events",
              image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=400&h=300&fit=crop",
              userId: "exampleUserId123",
              clubId: clubUid,
              clubName: club.clubName,
              createdAt: new Date()
            };
            
            await setDoc(doc(collection(db, 'certificates'), `${clubUid}_cert2`), certificate2Data);
            
            // Create EB members for the club in the members subcollection
            for (let i = 1; i <= 3; i++) {
              const ebMemberData = {
                name: `ebmember${i}`,
                email: `ebmember${i}@${club.clubName}.com`,
                role: i === 1 ? "President" : i === 2 ? "Vice President" : "Secretary",
                department: "Executive Board",
                year: "",
                collegeId: `EB${i.toString().padStart(3, '0')}`,
                phone: `+123456789${i + 5}`,
                bio: `Executive board member of ${club.clubName}`,
                interests: ["Leadership", "Management", "Organization"],
                skills: ["Leadership", "Communication", "Planning"],
                clubId: clubUid,
                joinDate: new Date().toISOString(),
                status: "active",
                attendance: Math.floor(Math.random() * 20) + 10,
                events: Math.floor(Math.random() * 10) + 5,
                createdAt: new Date()
              };
              
              await setDoc(doc(collection(db, 'clubs', clubUid, 'members'), `ebmember${i}`), ebMemberData);
            }
            
            setStatus(`Created events, awards, certificates, and EB members in the members subcollection for ${club.clubName}!`);
          } catch (error: any) {
            console.error(`Error creating events, awards, certificates, or EB members for ${club.clubName}:`, error);
            setStatus(`Error creating additional data for ${club.clubName}: ${error.message || error}`);
          }
        }
      }
      
      setStatus('All clubs registered and events created successfully!');
    } catch (error: any) {
      console.error('Error registering clubs:', error);
      setStatus(`Error registering clubs: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const registerStudents = async () => {
    setLoading(true);
    setStatus('Registering students...');
    
    try {
      for (const student of exampleStudents) {
        setStatus(`Registering ${student.name}...`);
        
        // Check if student already exists
        const usersQuery = query(collection(db, 'users'), where('email', '==', student.email));
        const usersSnapshot = await getDocs(usersQuery);
        
        if (usersSnapshot.empty) {
          // Create auth user
          const userCredential = await createUserWithEmailAndPassword(auth, student.email, student.password);
          const uid = userCredential.user.uid;
          
          // Create student document
          const studentData = {
            name: student.name,
            email: student.email,
            role: 'student',
            department: student.department,
            year: student.year,
            collegeId: student.collegeId,
            phone: student.phone,
            bio: student.bio,
            interests: student.interests,
            skills: student.skills,
            createdAt: new Date()
          };
          
          await setDoc(doc(db, 'users', uid), studentData);
          setStatus(`Registered ${student.name} successfully!`);
        } else {
          setStatus(`${student.name} already exists, skipping...`);
        }
      }
      
      setStatus('All students registered successfully!');
    } catch (error: any) {
      console.error('Error registering students:', error);
      setStatus(`Error registering students: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const registerAll = async () => {
    await registerClubs();
    await registerStudents();
    setStatus('All data registered successfully! Clubs, students, events, awards, certificates, and EB members in subcollections created.');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Register Example Data</h2>
          <p className="text-gray-600">Register clubs and students with simple names for presentation. Each club will have 2 events, 2 awards, 2 certificates, and 3 EB members created in the members subcollection.</p>
        </div>

        {status && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 text-center">{status}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Clubs</h3>
            <ul className="text-sm text-gray-600">
              <li>clubexample1</li>
              <li>clubexample2</li>
              <li>clubexample3</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Students</h3>
            <ul className="text-sm text-gray-600">
              <li>student1</li>
              <li>student2</li>
              <li>student3</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Events</h3>
            <ul className="text-sm text-gray-600">
              <li>2 per club</li>
              <li>Monthly Meeting</li>
              <li>Workshop</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Awards & Certs</h3>
            <ul className="text-sm text-gray-600">
              <li>2 awards per club</li>
              <li>2 certs per club</li>
              <li>3 EB members (subcollection)</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Password</h3>
            <p className="text-sm text-gray-600">password123</p>
          </div>
        </div>

        <div className="space-y-4">
          <motion.button
            onClick={registerClubs}
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              loading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200`}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              'Register Clubs Only'
            )}
          </motion.button>

          <motion.button
            onClick={registerStudents}
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              loading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200`}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              'Register Students Only'
            )}
          </motion.button>

          <motion.button
            onClick={registerAll}
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200`}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              'Register All Data'
            )}
          </motion.button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterExampleDataPage;