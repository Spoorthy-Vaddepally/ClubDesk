import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronLeft
} from 'lucide-react';

import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebase'; // Adjust this import to your firebase config file
import { useAuth } from '../../contexts/AuthContext';

const db = getFirestore(app);
const auth = getAuth(app);

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'Workshop',
    capacity: '',
    description: '',
    image: '',
    registrationLink: '',
    isOnline: false,
    requiresRegistration: true,
    sendNotification: true,
    isPaidEvent: false,
    paymentAmount: '',
    paymentQRCode: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendEventNotification = async (eventData: any) => {
    if (!user) return;
    
    try {
      // Get all club members
      const membersRef = collection(db, 'clubs', user.uid, 'members');
      const membersSnapshot = await getDocs(membersRef);
      
      if (membersSnapshot.empty) {
        console.log('No members found to notify.');
        return;
      }
      
      // Create a notification for all members
      const notificationData = {
        title: 'New Event Announcement',
        message: `A new event "${eventData.name}" has been created by your club. Check it out!`,
        sender: user.name || 'Club Head',
        senderId: user.uid,
        timestamp: new Date(),
        read: false,
        type: 'event_announcement'
      };
      
      // Send notification to each member
      const notificationPromises = membersSnapshot.docs.map(async (doc) => {
        const memberData = doc.data();
        try {
          // Try to add to user's notifications using different approaches
          if (memberData.userId) {
            await addDoc(collection(db, 'users', memberData.userId, 'notifications'), notificationData);
            return;
          }
          
          // Try using doc.id as userId
          if (doc.id) {
            await addDoc(collection(db, 'users', doc.id, 'notifications'), notificationData);
            return;
          }
          
          // Try to find user by email
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
        } catch (error) {
          console.error('Error sending notification to member:', memberData, error);
        }
      });
      
      await Promise.all(notificationPromises);
      console.log('Notifications sent to all club members!');
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in as a club to create an event.');
        setLoading(false);
        return;
      }

      // Assuming your clubs are stored with document IDs matching user.uid
      // If your club document IDs are different, adjust this logic accordingly
      const clubId = user.uid;

      // Reference to the events subcollection of the current club
      const eventsRef = collection(db, 'clubs', clubId, 'events');

      // Create event object to save
      const eventData = {
        name: formData.name,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        type: formData.type,
        capacity: Number(formData.capacity),
        description: formData.description,
        image: formData.image || null,
        registrationLink: formData.registrationLink || null,
        isOnline: formData.isOnline,
        requiresRegistration: formData.requiresRegistration,
        sendNotification: formData.sendNotification,
        isPaidEvent: formData.isPaidEvent,
        paymentAmount: formData.isPaidEvent ? Number(formData.paymentAmount) : null,
        paymentQRCode: formData.isPaidEvent ? formData.paymentQRCode : null,
        registered: 0, // Track number of registered students
        createdAt: serverTimestamp(),
        createdBy: clubId
      };

      const docRef = await addDoc(eventsRef, eventData);
      
      // Send notifications if requested
      if (formData.sendNotification) {
        await sendEventNotification(eventData);
      }

      // After success, navigate back to events list
      navigate('/club/events');

    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/club/events')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Events
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="mt-1 text-gray-600">Fill in the details to create a new club event</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Show error if any */}
          {error && (
            <div className="text-red-600 font-medium mb-4">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Event Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter event name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Event Type
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option>Workshop</option>
                    <option>Meeting</option>
                    <option>Talk</option>
                    <option>Competition</option>
                    <option>Networking</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id="startTime"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id="endTime"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter event location"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  id="capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter maximum number of attendees"
                  min="1"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe your event in detail"
                />
              </div>
            </div>
          </div>

          {/* Registration and Payment */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Registration & Payment</h2>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requiresRegistration"
                  checked={formData.requiresRegistration}
                  onChange={(e) => setFormData({...formData, requiresRegistration: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="requiresRegistration" className="ml-2 block text-sm text-gray-900">
                  Requires Registration
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPaidEvent"
                  checked={formData.isPaidEvent}
                  onChange={(e) => setFormData({...formData, isPaidEvent: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isPaidEvent" className="ml-2 block text-sm text-gray-900">
                  This is a paid event
                </label>
              </div>
              
              {formData.isPaidEvent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">
                      Payment Amount (₹)
                    </label>
                    <input
                      type="number"
                      id="paymentAmount"
                      value={formData.paymentAmount}
                      onChange={(e) => setFormData({...formData, paymentAmount: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="paymentQRCode" className="block text-sm font-medium text-gray-700">
                      Payment QR Code URL
                    </label>
                    <input
                      type="text"
                      id="paymentQRCode"
                      value={formData.paymentQRCode}
                      onChange={(e) => setFormData({...formData, paymentQRCode: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter QR code image URL"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendNotification"
                  checked={formData.sendNotification}
                  onChange={(e) => setFormData({...formData, sendNotification: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="sendNotification" className="ml-2 block text-sm text-gray-900">
                  Send notification to club members
                </label>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Event Image URL
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/event-image.jpg"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="registrationLink" className="block text-sm font-medium text-gray-700">
                  Registration Link
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="registrationLink"
                    value={formData.registrationLink}
                    onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/register"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isOnline}
                      onChange={() => setFormData({ ...formData, isOnline: !formData.isOnline })}
                      className="rounded"
                    />
                    <span>Online Event</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.requiresRegistration}
                      onChange={() => setFormData({ ...formData, requiresRegistration: !formData.requiresRegistration })}
                      className="rounded"
                    />
                    <span>Requires Registration</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.sendNotification}
                      onChange={() => setFormData({ ...formData, sendNotification: !formData.sendNotification })}
                      className="rounded"
                    />
                    <span>Send Notification</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/club/events')}
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateEvent;
