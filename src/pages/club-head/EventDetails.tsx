import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Bell,
  Star,
  MessageCircle,
  ThumbsUp,
  ChevronLeft,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, collection, getDocs, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: string;
  description: string;
  capacity: number;
  registered: number;
  image?: string;
  status: 'upcoming' | 'completed';
  isPaidEvent?: boolean;
  paymentAmount?: number;
  paymentQRCode?: string;
}

interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: any;
  likes: number;
  likedBy: string[];
}

// Add Registration interface
interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  paymentReceipt?: string;
  transactionId?: string;
  registeredAt: any;
}

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]); // Add registrations state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!user || !eventId) return;
      
      try {
        setLoading(true);
        // Fetch event details
        const eventDocRef = doc(db, 'clubs', user.uid, 'events', eventId);
        console.log('Fetching event from:', eventDocRef.path);
        const eventDoc = await getDoc(eventDocRef);
        
        if (!eventDoc.exists()) {
          console.log('Event document does not exist');
          setError('Event not found');
          return;
        }
        
        const eventData = eventDoc.data();
        console.log('Event data:', eventData);
        const today = new Date();
        const eventDate = new Date(eventData.date);
        console.log('Today date:', today);
        console.log('Event date:', eventDate);
        console.log('Event date >= Today:', eventDate >= today);
        const status = eventDate >= today ? 'upcoming' : 'completed';
        console.log('Event status:', status);
        
        setEvent({
          id: eventDoc.id,
          name: eventData.name || 'Untitled Event',
          date: eventData.date || '',
          time: eventData.time || 'TBD',
          location: eventData.location || 'TBD',
          type: eventData.type || 'General',
          description: eventData.description || '',
          capacity: eventData.capacity || 0,
          registered: eventData.registered || 0,
          image: eventData.image || '',
          status,
          isPaidEvent: eventData.isPaidEvent || false,
          paymentAmount: eventData.paymentAmount,
          paymentQRCode: eventData.paymentQRCode
        });
        
        // Fetch registrations for this event
        await fetchRegistrations(eventId);
        
        // If event is completed, fetch feedback
        if (status === 'completed') {
          console.log('Fetching feedback for completed event');
          await fetchFeedbackData(eventId);
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [user, eventId]);

  const fetchFeedbackData = async (eventId: string) => {
    console.log('Fetching feedback for event:', eventId);
    try {
      const feedbackQuery = query(
        collection(db, 'eventFeedback'),
        where('eventId', '==', eventId)
      );
      
      const feedbackSnapshot = await getDocs(feedbackQuery);
      console.log('Feedback documents found:', feedbackSnapshot.size);
      const feedbackList: Feedback[] = [];
      
      feedbackSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Feedback doc:', doc.id, data);
        feedbackList.push({
          id: doc.id,
          eventId: data.eventId,
          userId: data.userId,
          userName: data.userName || 'Anonymous',
          rating: data.rating || 0,
          comment: data.comment || '',
          timestamp: data.timestamp,
          likes: data.likes || 0,
          likedBy: data.likedBy || []
        });
      });
      
      // Sort by timestamp (newest first)
      feedbackList.sort((a, b) => 
        b.timestamp?.toDate?.().getTime() - a.timestamp?.toDate?.().getTime() || 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setFeedback(feedbackList);
    } catch (err) {
      console.error('Error fetching feedback data:', err);
    }
  };

  // Add fetchRegistrations function
  const fetchRegistrations = async (eventId: string) => {
    console.log('Fetching registrations for event:', eventId);
    try {
      const registrationsQuery = query(
        collection(db, 'eventRegistrations'),
        where('eventId', '==', eventId)
      );
      
      const registrationsSnapshot = await getDocs(registrationsQuery);
      console.log('Registration documents found:', registrationsSnapshot.size);
      const registrationsList: Registration[] = [];
      
      registrationsSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Registration doc:', doc.id, data);
        registrationsList.push({
          id: doc.id,
          eventId: data.eventId,
          userId: data.userId,
          userName: data.userName || 'User',
          userEmail: data.userEmail,
          status: data.status || 'pending',
          paymentReceipt: data.paymentReceipt,
          transactionId: data.transactionId,
          registeredAt: data.registeredAt
        });
      });
      
      // Sort by registration date (newest first)
      registrationsList.sort((a, b) => 
        b.registeredAt?.toDate?.().getTime() - a.registeredAt?.toDate?.().getTime() || 
        new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
      );
      
      setRegistrations(registrationsList);
    } catch (err) {
      console.error('Error fetching registrations data:', err);
    }
  };

  const handleSendNotification = async () => {
    if (!user || !event) return;
    
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
        title: `Update: ${event.name}`,
        message: `There's an update about the "${event.name}" event. Check it out!`,
        sender: user.name || 'Club Head',
        senderId: user.uid,
        timestamp: new Date(),
        read: false,
        type: 'event_update'
      };
      
      // Send notification to each member
      const notificationPromises = membersSnapshot.docs.map(async (doc) => {
        const memberData = doc.data();
        try {
          if (memberData.userId) {
            await addDoc(collection(db, 'users', memberData.userId, 'notifications'), notificationData);
            return;
          }
          
          if (doc.id) {
            await addDoc(collection(db, 'users', doc.id, 'notifications'), notificationData);
            return;
          }
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

  // Add function to update registration status
  const updateRegistrationStatus = async (registrationId: string, status: 'confirmed' | 'rejected') => {
    try {
      const registrationDocRef = doc(db, 'eventRegistrations', registrationId);
      await updateDoc(registrationDocRef, {
        status: status
      });
      
      // Update local state
      setRegistrations(registrations.map(reg => 
        reg.id === registrationId ? { ...reg, status } : reg
      ));
      
      alert(`Registration ${status === 'confirmed' ? 'confirmed' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error updating registration status:', error);
      alert('Failed to update registration status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Error</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={() => navigate('/club-head/events')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Event not found</h2>
        <p className="mt-2 text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/club-head/events')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Events
        </button>
      </div>
    );
  }

  // Calculate average rating for completed events
  const averageRating = feedback.length > 0 
    ? feedback.reduce((sum, fb) => sum + fb.rating, 0) / feedback.length 
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/club/events')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Events
        </button>
      </div>

      {/* Event Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="relative">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.name} 
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center">
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
              <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
              <p className="text-primary-600 font-medium mt-1">{event.type}</p>
            </div>
            <div className="flex space-x-2">
              {event.status === 'upcoming' ? (
                <>
                  <Link
                    to={`/club/events/edit/${event.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={handleSendNotification}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Bell size={16} className="mr-1" />
                    Notify
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSendNotification}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Send size={16} className="mr-1" />
                  Share Results
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span>{event.date ? new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                }) : 'Date not set'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Users size={16} className="mr-2" />
                <span>{event.registered}/{event.capacity} registered</span>
              </div>
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
              
              {/* Registration Management Link */}
              <div className="mt-4">
                <Link
                  to="/club/events/registrations"
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
                >
                  <Users size={16} className="mr-1" />
                  Manage Registrations
                </Link>
              </div>
            </div>
          </div>
          
          {event.description && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900">Description</h3>
              <p className="text-gray-600 mt-1 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Section (only for completed events) */}
      {event.status === 'completed' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Event Feedback</h2>
            {feedback.length > 0 && (
              <div className="flex items-center">
                <Star className="text-yellow-400 fill-current" size={20} />
                <span className="ml-1 text-lg font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <span className="ml-1 text-gray-600">({feedback.length} reviews)</span>
              </div>
            )}
          </div>
          
          {feedback.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle size={48} className="mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No feedback yet</h3>
              <p className="mt-1 text-gray-600">
                No attendees have submitted feedback for this event yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {feedback.map((fb) => (
                <div key={fb.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                        {fb.userName.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{fb.userName}</h4>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                className={star <= fb.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {fb.timestamp?.toDate 
                            ? fb.timestamp.toDate().toLocaleDateString() 
                            : new Date(fb.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {fb.comment && (
                        <p className="mt-3 text-gray-600">{fb.comment}</p>
                      )}
                      
                      {fb.likes > 0 && (
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <ThumbsUp size={14} className="mr-1" />
                          {fb.likes} like{fb.likes !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Registrations Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Event Registrations</h2>
          <div className="text-sm text-gray-600">
            {registrations.length} registration{registrations.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {registrations.length === 0 ? (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No registrations yet</h3>
            <p className="mt-1 text-gray-600">
              No students have registered for this event yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{registration.userName}</div>
                        {registration.userEmail && (
                          <div className="text-sm text-gray-500">{registration.userEmail}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registration.registeredAt?.toDate 
                        ? registration.registeredAt.toDate().toLocaleDateString() 
                        : new Date(registration.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        registration.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : registration.status === 'rejected' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {registration.status === 'confirmed' ? (
                          <CheckCircle size={12} className="mr-1" />
                        ) : registration.status === 'rejected' ? (
                          <XCircle size={12} className="mr-1" />
                        ) : (
                          <AlertCircle size={12} className="mr-1" />
                        )}
                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registration.paymentReceipt ? (
                        <span className="inline-flex items-center text-green-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Paid
                        </span>
                      ) : (
                        <span className="text-gray-500">Free</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {registration.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateRegistrationStatus(registration.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                              title="Confirm Registration"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => updateRegistrationStatus(registration.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Registration"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {registration.paymentReceipt && (
                          <button
                            onClick={() => window.open(registration.paymentReceipt, '_blank')}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Payment Receipt"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;