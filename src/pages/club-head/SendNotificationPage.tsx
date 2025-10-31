import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Search } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  [key: string]: any; // allow other member properties if needed
}

const SendNotificationPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersSnapshot = await getDocs(collection(db, 'users'));
        const membersData = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Member[];
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  const handleMemberSelect = (memberId: string) => {
    setSelectedMembers(prevSelected =>
      prevSelected.includes(memberId)
        ? prevSelected.filter(id => id !== memberId)
        : [...prevSelected, memberId]
    );
  };

  const handleSendNotification = () => {
    if (!message.trim()) {
      alert('Please enter a notification message.');
      return;
    }
    if (selectedMembers.length === 0) {
      alert('Please select at least one member to send notification.');
      return;
    }
    // TODO: Implement actual notification sending logic here
    console.log('Sending notification to member IDs:', selectedMembers);
    console.log('Message:', message);

    // Reset after sending
    setMessage('');
    setSelectedMembers([]);
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Users</h2>
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
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
        >
          Send Notification
        </button>
      </div>
    </div>
  );
};

export default SendNotificationPage;

