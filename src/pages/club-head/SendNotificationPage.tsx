import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where, addDoc, getDoc, doc } from 'firebase/firestore';
import { Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Member {
  id: string;
  name: string;
  [key: string]: any; // allow other member properties if needed
}

const SendNotificationPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user) return;
      
      try {
        // Fetch only members of this club
        const membersRef = collection(db, 'clubs', user.uid, 'members');
        const membersSnapshot = await getDocs(membersRef);
        
        // Get user details for each member with improved error handling
        const membersDataPromises = membersSnapshot.docs.map(async (document) => {
          const memberData: any = document.data();
          
          // Try multiple approaches to get user details
          // Approach 1: Use userId field if available
          if (memberData.userId) {
            try {
              const userDocRef = doc(db, 'users', memberData.userId);
              const userDoc = await getDoc(userDocRef);
              
              if (userDoc.exists()) {
                const userData: any = userDoc.data();
                return { 
                  id: memberData.userId, 
                  name: userData.name || memberData.name || 'Unknown User', 
                  ...userData,
                  memberId: document.id // Keep reference to member document
                };
              }
            } catch (error) {
              console.error('Error fetching user data by userId:', memberData.userId, error);
            }
          }
          
          // Approach 2: Use document.id as userId if userId field is not available
          try {
            const userDocRef = doc(db, 'users', document.id);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userData: any = userDoc.data();
              return { 
                id: document.id, 
                name: userData.name || memberData.name || 'Unknown User', 
                ...userData,
                memberId: document.id
              };
            }
          } catch (error) {
            console.error('Error fetching user data by document.id:', document.id, error);
          }
          
          // Approach 3: Try to get user details from users collection by email
          if (memberData.email) {
            try {
              const userRef = collection(db, 'users');
              const userQuery = query(userRef, where('email', '==', memberData.email));
              const userSnapshot = await getDocs(userQuery);
              
              if (!userSnapshot.empty) {
                const userData: any = userSnapshot.docs[0].data();
                return { 
                  id: userSnapshot.docs[0].id, 
                  name: userData.name || memberData.name || 'Unknown User', 
                  ...userData,
                  memberId: document.id
                };
              }
            } catch (error) {
              console.error('Error fetching user data by email:', memberData.email, error);
            }
          }
          
          // Fallback to member data if all approaches fail
          return { 
            id: document.id, 
            name: memberData.name || 'Unknown User', 
            ...memberData,
            memberId: document.id
          };
        });
        
        const membersData = await Promise.all(membersDataPromises);
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching members:', error);
        // Set empty array if there's an error
        setMembers([]);
      }
    };

    fetchMembers();
  }, [user]);

  const handleMemberSelect = (memberId: string) => {
    setSelectedMembers(prevSelected =>
      prevSelected.includes(memberId)
        ? prevSelected.filter(id => id !== memberId)
        : [...prevSelected, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      // Deselect all
      setSelectedMembers([]);
    } else {
      // Select all visible members
      setSelectedMembers(filteredMembers.map(member => member.id));
    }
  };

  const handleSendNotification = async () => {
    if (!message.trim()) {
      alert('Please enter a notification message.');
      return;
    }
    if (selectedMembers.length === 0) {
      alert('Please select at least one member to send notification.');
      return;
    }
    
    setLoading(true);
    try {
      // Send notification to each selected member with improved error handling
      const notificationPromises = selectedMembers.map(async (memberId) => {
        // Find the member data
        const member = members.find(m => m.id === memberId);
        if (!member) {
          console.error('Member not found:', memberId);
          return;
        }
        
        // Create notification in the user's notifications subcollection
        const notificationData = {
          title: 'Club Notification',
          message: message,
          sender: user?.name || 'Club Head',
          senderId: user?.uid || '',
          timestamp: new Date(),
          read: false,
          type: 'club_notification'
        };
        
        try {
          // Try to add to user's notifications
          await addDoc(collection(db, 'users', memberId, 'notifications'), notificationData);
        } catch (error) {
          console.error('Error sending notification to user:', memberId, error);
          // Fallback: Add to club's notifications for this member
          try {
            await addDoc(collection(db, 'clubs', user?.uid || '', 'memberNotifications'), {
              ...notificationData,
              memberId: memberId,
              memberName: (member as any).name || 'Unknown Member'
            });
          } catch (fallbackError) {
            console.error('Error sending fallback notification:', fallbackError);
          }
        }
      });
      
      await Promise.all(notificationPromises);
      
      alert('Notifications sent successfully!');
      
      // Reset after sending
      setMessage('');
      setSelectedMembers([]);
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Failed to send notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Send Notification</h1>
          <p className="mt-1 text-gray-600">Personalize your notifications to club members or followers</p>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compose Your Message</h2>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your notification message here..."
          className="block w-full h-32 border border-gray-300 rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Member Selection */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Select Users</h2>
          <button
            onClick={handleSelectAll}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {selectedMembers.length === filteredMembers.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="relative flex-1 mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredMembers.map(member => (
            <div key={member.id} className="flex items-center justify-between p-2 border-b border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.id)}
                  onChange={() => handleMemberSelect(member.id)}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">{member.name}</span>
              </div>
            </div>
          ))}
          {filteredMembers.length === 0 && (
            <p className="text-center text-gray-500 text-sm">No members found.</p>
          )}
        </div>
      </div>

      {/* Send Notification Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSendNotification}
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Notification'}
        </button>
      </div>
    </div>
  );
};

export default SendNotificationPage;