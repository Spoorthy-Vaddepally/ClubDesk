import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  MessageCircle, 
  ChevronLeft,
  QrCode,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, collection, getDocs, addDoc, query, where, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface Event {
  id: string;
  name: string;
  club: string;
  clubId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  image: string;
  capacity: number;
  registered: number;
  isPaidEvent: boolean;
  paymentAmount?: number;
  paymentQRCode?: string;
  requiresRegistration: boolean;
}

interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
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
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId || !user) return;

      try {
        setLoading(true);
        // Find the event across all clubs
        const clubsRef = collection(db, 'clubs');
        const clubsSnapshot = await getDocs(clubsRef);
        
        let foundEvent: Event | null = null;
        
        for (const clubDoc of clubsSnapshot.docs) {
          const clubId = clubDoc.id;
          const clubData = clubDoc.data();
          
          try {
            const eventDocRef = doc(db, 'clubs', clubId, 'events', eventId);
            const eventDoc = await getDoc(eventDocRef);
            
            if (eventDoc.exists()) {
              const eventData = eventDoc.data();
              foundEvent = {
                id: eventDoc.id,
                name: eventData.name || 'Event',
                club: clubData.name || 'Club',
                clubId: clubId,
                date: eventData.date || '',
                startTime: eventData.startTime || 'TBD',
                endTime: eventData.endTime || 'TBD',
                location: eventData.location || 'TBD',
                description: eventData.description || '',
                image: eventData.image || 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg',
                capacity: eventData.capacity || 0,
                registered: eventData.registered || 0,
                isPaidEvent: eventData.isPaidEvent || false,
                paymentAmount: eventData.paymentAmount,
                paymentQRCode: eventData.paymentQRCode,
                requiresRegistration: eventData.requiresRegistration !== false
              };
              break;
            }
          } catch (error) {
            console.log('Event not found in club:', clubId);
          }
        }
        
        if (foundEvent) {
          setEvent(foundEvent);
          
          // Check if user is already registered
          const registrationQuery = query(
            collection(db, 'eventRegistrations'),
            where('eventId', '==', eventId),
            where('userId', '==', user.uid)
          );
          
          const registrationSnapshot = await getDocs(registrationQuery);
          if (!registrationSnapshot.empty) {
            const regData = registrationSnapshot.docs[0].data();
            setRegistration({
              id: registrationSnapshot.docs[0].id,
              eventId: regData.eventId,
              userId: regData.userId,
              userName: regData.userName || user.name || 'User',
              status: regData.status || 'pending',
              paymentReceipt: regData.paymentReceipt,
              transactionId: regData.transactionId,
              registeredAt: regData.registeredAt
            });
          }
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, user]);

  const handleRegister = async () => {
    if (!event || !user) return;
    
    try {
      // Check if event has capacity
      if (event.capacity > 0 && event.registered >= event.capacity) {
        alert('Sorry, this event has reached its capacity limit.');
        return;
      }
      
      // Create registration
      const registrationData = {
        eventId: event.id,
        userId: user.uid,
        userName: user.name || 'User',
        status: event.isPaidEvent ? 'pending' : 'confirmed',
        registeredAt: new Date()
      };
      
      await addDoc(collection(db, 'eventRegistrations'), registrationData);
      
      // Update event registered count
      const eventDocRef = doc(db, 'clubs', event.clubId, 'events', event.id);
      await updateDoc(eventDocRef, {
        registered: increment(1)
      });
      
      // Update local state
      setRegistration({
        id: '',
        eventId: event.id,
        userId: user.uid,
        userName: user.name || 'User',
        status: event.isPaidEvent ? 'pending' : 'confirmed',
        registeredAt: new Date()
      });
      
      // Update event registered count locally
      setEvent({
        ...event,
        registered: event.registered + 1
      });
      
      alert(event.isPaidEvent 
        ? 'Registration submitted! Please complete payment to confirm your spot.' 
        : 'Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event. Please try again.');
    }
  };

  const handlePaymentUpload = async () => {
    if (!event || !registration || !paymentReceipt || !transactionId) {
      alert('Please provide both payment receipt and transaction ID.');
      return;
    }
    
    setUploading(true);
    
    try {
      // In a real app, you would upload the file to storage and get a URL
      // For now, we'll just simulate this with a placeholder
      const receiptUrl = 'https://example.com/receipt-placeholder.jpg';
      
      // Update registration with payment details
      const registrationDocRef = doc(db, 'eventRegistrations', registration.id);
      await updateDoc(registrationDocRef, {
        paymentReceipt: receiptUrl,
        transactionId: transactionId,
        status: 'pending' // Wait for club head verification
      });
      
      // Update local state
      setRegistration({
        ...registration,
        paymentReceipt: receiptUrl,
        transactionId: transactionId,
        status: 'pending'
      });
      
      setPaymentReceipt(null);
      setTransactionId('');
      
      alert('Payment details submitted! Waiting for club head verification.');
    } catch (error) {
      console.error('Error uploading payment:', error);
      alert('Failed to submit payment details. Please try again.');
    } finally {
      setUploading(false);
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
          onClick={() => navigate('/student/events')}
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
          onClick={() => navigate('/student/events')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Events
        </button>
      </div>
    );
  }

  const isFullyBooked = event.capacity > 0 && event.registered >= event.capacity;
  const canRegister = event.requiresRegistration && !registration && !isFullyBooked;
  const showPaymentSection = event.isPaidEvent && registration && registration.status !== 'confirmed';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/student/events')}
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
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
              <p className="text-primary-600 font-medium mt-1">{event.club}</p>
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
                <span>{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Users size={16} className="mr-2" />
                <span>{event.registered}/{event.capacity > 0 ? event.capacity : 'No limit'} registered</span>
              </div>
              {event.capacity > 0 && (
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
              )}
              
              {event.isPaidEvent && (
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">₹{event.paymentAmount}</span>
                  <span className="ml-2 text-sm text-gray-500">(Paid Event)</span>
                </div>
              )}
            </div>
          </div>
          
          {event.description && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900">Description</h3>
              <p className="text-gray-600 mt-1 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
          
          {/* Registration Status */}
          <div className="mt-6">
            {isFullyBooked ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <h3 className="ml-2 text-sm font-medium text-red-800">Event Full</h3>
                </div>
                <p className="mt-1 text-sm text-red-700">
                  This event has reached its capacity limit. Registration is closed.
                </p>
              </div>
            ) : registration ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  {registration.status === 'confirmed' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : registration.status === 'pending' ? (
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                  <h3 className="ml-2 text-sm font-medium text-blue-800">
                    {registration.status === 'confirmed' 
                      ? 'Registration Confirmed' 
                      : registration.status === 'pending' 
                        ? 'Registration Pending' 
                        : 'Registration Rejected'}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-blue-700">
                  {registration.status === 'confirmed' 
                    ? 'You are registered for this event.' 
                    : registration.status === 'pending' 
                      ? 'Your registration is pending confirmation.' 
                      : 'Your registration has been rejected.'}
                </p>
              </div>
            ) : event.requiresRegistration ? (
              <button
                onClick={handleRegister}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Register for Event
              </button>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <h3 className="ml-2 text-sm font-medium text-green-800">No Registration Required</h3>
                </div>
                <p className="mt-1 text-sm text-green-700">
                  This event does not require registration. Just show up!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Section (for paid events) */}
      {showPaymentSection && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Complete Payment</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Payment Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">Amount: <span className="font-medium">₹{event.paymentAmount}</span></p>
                <p className="text-gray-600 mt-1">Event: {event.name}</p>
              </div>
              
              {event.paymentQRCode && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Scan to Pay</h3>
                  <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
                    <img 
                      src={event.paymentQRCode} 
                      alt="Payment QR Code" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 text-center">Scan this QR code to make payment</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Upload Payment Proof</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter transaction ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Receipt
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                          <span>Upload a file</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            accept="image/*"
                            onChange={(e) => setPaymentReceipt(e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                  {paymentReceipt && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected: {paymentReceipt.name}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handlePaymentUpload}
                  disabled={uploading || !paymentReceipt || !transactionId}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Submit Payment Proof'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;