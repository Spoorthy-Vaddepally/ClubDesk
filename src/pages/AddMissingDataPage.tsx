import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';

const AddMissingDataPage = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const addMissingData = async () => {
    setLoading(true);
    setStatus('Adding missing data to existing clubs...');
    
    try {
      // Get all existing clubs
      const clubsSnapshot = await getDocs(collection(db, 'clubs'));
      
      if (clubsSnapshot.empty) {
        setStatus('No clubs found. Please register clubs first.');
        setLoading(false);
        return;
      }
      
      for (const clubDoc of clubsSnapshot.docs) {
        const clubUid = clubDoc.id;
        const clubData = clubDoc.data();
        const clubName = clubData.clubName || clubData.name || 'Unknown Club';
        
        setStatus(`Adding data to ${clubName}...`);
        
        // Create two events for the club
        setStatus(`Creating events for ${clubName}...`);
        
        // Event 1
        const event1Data = {
          name: `${clubName} Monthly Meeting`,
          description: `Monthly meeting for ${clubName} members to discuss upcoming activities and projects.`,
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          time: "18:00",
          location: "Main Campus Building, Room 101",
          capacity: 50,
          registered: 0,
          clubId: clubUid,
          clubName: clubName,
          createdAt: new Date(),
          isPublic: true,
          type: "Meeting"
        };
        
        await setDoc(doc(collection(db, 'clubs', clubUid, 'events'), `event1`), event1Data);
        
        // Event 2
        const event2Data = {
          name: `${clubName} Workshop`,
          description: `Hands-on workshop organized by ${clubName} for members and interested students.`,
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          time: "15:00",
          location: "Innovation Center, Hall A",
          capacity: 30,
          registered: 0,
          clubId: clubUid,
          clubName: clubName,
          createdAt: new Date(),
          isPublic: true,
          type: "Workshop"
        };
        
        await setDoc(doc(collection(db, 'clubs', clubUid, 'events'), `event2`), event2Data);
        
        setStatus(`Created 2 events for ${clubName}!`);
        
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
          clubName: clubName,
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
          clubName: clubName,
          createdAt: new Date()
        };
        
        await setDoc(doc(collection(db, 'awards'), `${clubUid}_award2`), award2Data);
        
        // Create sample certificates for the club
        const certificate1Data = {
          name: "Leadership Certificate",
          club: clubName,
          issueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
          category: "Achievement",
          description: "Certificate of completion for leadership training program",
          image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop",
          userId: "exampleUserId123",
          clubId: clubUid,
          clubName: clubName,
          createdAt: new Date()
        };
        
        await setDoc(doc(collection(db, 'certificates'), `${clubUid}_cert1`), certificate1Data);
        
        const certificate2Data = {
          name: "Event Participation Certificate",
          club: clubName,
          issueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
          category: "Participation",
          description: "Certificate for active participation in club events",
          image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=400&h=300&fit=crop",
          userId: "exampleUserId123",
          clubId: clubUid,
          clubName: clubName,
          createdAt: new Date()
        };
        
        await setDoc(doc(collection(db, 'certificates'), `${clubUid}_cert2`), certificate2Data);
        
        // Create EB members for the club in the members subcollection
        for (let i = 1; i <= 3; i++) {
          const ebMemberData = {
            name: `ebmember${i}`,
            email: `ebmember${i}@${clubName}.com`,
            role: i === 1 ? "President" : i === 2 ? "Vice President" : "Secretary",
            department: "Executive Board",
            year: "",
            collegeId: `EB${i.toString().padStart(3, '0')}`,
            phone: `+123456789${i + 5}`,
            bio: `Executive board member of ${clubName}`,
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
        
        setStatus(`Added all data to ${clubName} successfully!`);
      }
      
      setStatus('All missing data added successfully to all clubs!');
    } catch (error: any) {
      console.error('Error adding missing data:', error);
      setStatus(`Error adding missing data: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Missing Data</h2>
          <p className="text-gray-600">Add events, awards, certificates, and EB members to existing clubs</p>
        </div>

        {status && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 text-center">{status}</p>
          </div>
        )}

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
          <p className="text-yellow-700">
            This will add missing events, awards, certificates, and EB members to all existing clubs.
          </p>
        </div>

        <motion.button
          onClick={addMissingData}
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
              Adding Data...
            </>
          ) : (
            'Add Missing Data to All Clubs'
          )}
        </motion.button>

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

export default AddMissingDataPage;