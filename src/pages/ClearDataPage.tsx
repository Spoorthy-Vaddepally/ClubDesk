import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ClearDataPage = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const clearAllData = async () => {
    setLoading(true);
    setStatus('Clearing all data...');
    
    try {
      // Clear clubs collection
      setStatus('Clearing clubs...');
      const clubsSnapshot = await getDocs(collection(db, 'clubs'));
      const clubDeletePromises = [];
      for (const docSnapshot of clubsSnapshot.docs) {
        clubDeletePromises.push(deleteDoc(doc(db, 'clubs', docSnapshot.id)));
      }
      await Promise.all(clubDeletePromises);
      
      // Clear users collection
      setStatus('Clearing users...');
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userDeletePromises = [];
      for (const docSnapshot of usersSnapshot.docs) {
        userDeletePromises.push(deleteDoc(doc(db, 'users', docSnapshot.id)));
      }
      await Promise.all(userDeletePromises);
      
      // Clear events collection
      setStatus('Clearing events...');
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const eventDeletePromises = [];
      for (const docSnapshot of eventsSnapshot.docs) {
        eventDeletePromises.push(deleteDoc(doc(db, 'events', docSnapshot.id)));
      }
      await Promise.all(eventDeletePromises);
      
      setStatus('All data cleared successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error clearing data:', error);
      setStatus('Error clearing data. Please check the console for details.');
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Clear All Data</h2>
          <p className="text-gray-600">This will remove all clubs, students, and events from the database</p>
        </div>

        {status && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 text-center">{status}</p>
          </div>
        )}

        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-red-700">
            Warning: This action cannot be undone. All clubs, students, and events will be permanently deleted from the database. 
            Note: Firebase Authentication accounts will remain and must be deleted separately through the Firebase Console.
          </p>
        </div>

        <motion.button
          onClick={clearAllData}
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
            loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200`}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Clearing Data...
            </>
          ) : (
            'Clear All Data'
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

export default ClearDataPage;