import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Search,
  Filter,
  Plus,
  Users,
  MapPin,
  Clock,
  MoreVertical,
  Bell,
  Edit,
  Trash2
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, query, where, doc, getDoc, addDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: 'upcoming' | 'completed';
  capacity: number;
  registered: number;
  image?: string;
}

const EventsManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch events data from Firebase
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch events from the events subcollection
        const eventsRef = collection(db, 'clubs', user.uid, 'events');
        const eventsSnapshot = await getDocs(eventsRef);
        
        const eventsData: Event[] = [];
        
        eventsSnapshot.forEach((doc) => {
          const data = doc.data();
          const eventDate = new Date(data.date);
          const today = new Date();
          console.log(`Event: ${data.name || 'Untitled Event'}`);
          console.log(`Today: ${today}`);
          console.log(`Event Date: ${eventDate}`);
          console.log(`Event Date >= Today: ${eventDate >= today}`);
          const status = eventDate >= today ? 'upcoming' : 'completed';
          console.log(`Status: ${status}`);
          
          eventsData.push({
            id: doc.id,
            name: data.name || 'Untitled Event',
            date: data.date || '',
            time: data.time || 'TBD',
            location: data.location || 'TBD',
            type: data.type || 'General',
            status: status,
            capacity: data.capacity || 0,
            registered: data.registered || 0,
            image: data.image || ''
          });
        });
        
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  // Filter events
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      const matchesType = typeFilter === 'all' || event.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });

  const handleSendNotification = async () => {
    if (!user) return;
    
    try {
      // Get all club members
      const membersRef = collection(db, 'clubs', user.uid, 'members');
      const membersSnapshot = await getDocs(membersRef);
      
      if (membersSnapshot.empty) {
        alert('No members found to notify.');
        return;
      }
      
      // Create a notification for all members
      const notificationData = {
        title: 'New Event Announcement',
        message: 'A new event has been created by your club. Check it out!',
        sender: user.name || 'Club Head',
        senderId: user.uid,
        timestamp: new Date(),
        read: false,
        type: 'event_announcement'
      };
      
      // Send notification to each member with improved error handling
      const notificationPromises = membersSnapshot.docs.map(async (doc) => {
        const memberData = doc.data();
        try {
          // Try multiple approaches to send notification
          // Approach 1: Use userId field if available
          if (memberData.userId) {
            await addDoc(collection(db, 'users', memberData.userId, 'notifications'), notificationData);
            return;
          }
          
          // Approach 2: Use doc.id as userId if userId field is not available
          if (doc.id) {
            await addDoc(collection(db, 'users', doc.id, 'notifications'), notificationData);
            return;
          }
          
          // Approach 3: Try to find user by email
          if (memberData.email) {
            try {
              const usersRef = collection(db, 'users');
              const q = query(usersRef, where('email', '==', memberData.email));
              const userSnapshot = await getDocs(q);
              
              if (!userSnapshot.empty) {
                const userId = userSnapshot.docs[0].id;
                await addDoc(collection(db, 'users', userId, 'notifications'), notificationData);
                return;
              }
            } catch (emailError) {
              console.error('Error finding user by email:', memberData.email, emailError);
            }
          }
          
          // If all approaches fail, log the issue
          console.warn('Could not send notification to member:', memberData);
        } catch (error) {
          console.error('Error sending notification to member:', memberData, error);
        }
      });
      
      await Promise.all(notificationPromises);
      alert('Notifications sent to all club members!');
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Failed to send notifications. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="mt-1 text-gray-600">Create and manage club events</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Link
            to="/club-head/events/create"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus size={16} className="mr-2" />
            Create Event
          </Link>
          <button
            onClick={handleSendNotification}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Bell size={16} className="mr-2" />
            Send Notification
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Status filter */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Type filter */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="Workshop">Workshop</option>
                <option value="Meeting">Meeting</option>
                <option value="Talk">Talk</option>
                <option value="Competition">Competition</option>
                <option value="Networking">Networking</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-gray-500">Create your first event to get started.</p>
            <div className="mt-6">
              <Link
                to="/club-head/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus size={16} className="mr-2" />
                Create Event
              </Link>
            </div>
          </div>
        ) : (
          filteredEvents.map((event) => {
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="relative">
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.name} 
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center">
                      <Calendar size={48} className="text-white" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.status === 'upcoming' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                      <p className="text-sm text-gray-500">{event.type}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      <span className="text-sm">
                        {event.date ? new Date(event.date).toLocaleDateString() : 'Date not set'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock size={16} className="mr-2" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin size={16} className="mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users size={16} className="mr-2" />
                      <span className="text-sm">{event.registered}/{event.capacity} registered</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          event.capacity > 0 && event.registered >= event.capacity 
                            ? 'bg-red-500' 
                            : event.registered / event.capacity > 0.7 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ 
                          width: event.capacity > 0 
                            ? `${Math.min((event.registered / event.capacity) * 100, 100)}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <Link
                      to={`/club/events/${event.id}`}
                      onClick={() => console.log('View event clicked, ID:', event.id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Calendar size={16} className="mr-1" />
                      View
                    </Link>
                  </div>

                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventsManagement;