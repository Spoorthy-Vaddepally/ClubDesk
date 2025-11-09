import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Send,
  ArrowLeft
} from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface Event {
  id: string;
  name: string;
  club: string;
  clubId: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
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

const EventFeedback = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const fetchEventAndFeedback = async () => {
      if (!eventId || !user) return;

      try {
        // Fetch event details
        // We need to find which club this event belongs to
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
                time: eventData.time || 'TBD',
                location: eventData.location || 'TBD',
                description: eventData.description || '',
                image: eventData.image || 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg'
              };
              break;
            }
          } catch (error) {
            console.log('Event not found in club:', clubId);
          }
        }
        
        if (foundEvent) {
          setEvent(foundEvent);
          
          // Check if user has already submitted feedback
          const feedbackQuery = query(
            collection(db, 'eventFeedback'),
            where('eventId', '==', eventId),
            where('userId', '==', user.uid)
          );
          
          const feedbackSnapshot = await getDocs(feedbackQuery);
          if (!feedbackSnapshot.empty) {
            setHasSubmitted(true);
          }
          
          // Fetch all feedback for this event
          const allFeedbackQuery = query(
            collection(db, 'eventFeedback'),
            where('eventId', '==', eventId)
          );
          
          const allFeedbackSnapshot = await getDocs(allFeedbackQuery);
          const feedbackData: Feedback[] = [];
          
          for (const doc of allFeedbackSnapshot.docs) {
            const data = doc.data();
            feedbackData.push({
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
          }
          
          // Sort feedback by timestamp (newest first)
          feedbackData.sort((a, b) => 
            b.timestamp?.toDate?.().getTime() - a.timestamp?.toDate?.().getTime() || 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          setFeedback(feedbackData);
        }
      } catch (error) {
        console.error('Error fetching event and feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndFeedback();
  }, [eventId, user]);

  const handleSubmitFeedback = async () => {
    if (!user || !eventId || userRating === 0 || !event) return;
    
    setSubmitting(true);
    
    try {
      await addDoc(collection(db, 'eventFeedback'), {
        eventId: eventId,
        userId: user.uid,
        userName: user.name || 'User',
        rating: userRating,
        comment: userComment,
        timestamp: new Date(),
        likes: 0,
        likedBy: []
      });
      
      // Refresh feedback
      const allFeedbackQuery = query(
        collection(db, 'eventFeedback'),
        where('eventId', '==', eventId)
      );
      
      const allFeedbackSnapshot = await getDocs(allFeedbackQuery);
      const feedbackData: Feedback[] = [];
      
      for (const doc of allFeedbackSnapshot.docs) {
        const data = doc.data();
        feedbackData.push({
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
      }
      
      feedbackData.sort((a, b) => 
        b.timestamp?.toDate?.().getTime() - a.timestamp?.toDate?.().getTime() || 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setFeedback(feedbackData);
      setHasSubmitted(true);
      setUserComment('');
      setUserRating(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeFeedback = async (feedbackId: string, likedBy: string[], isLiked: boolean) => {
    if (!user) return;
    
    try {
      const feedbackDocRef = doc(db, 'eventFeedback', feedbackId);
      
      let newLikedBy = [...likedBy];
      if (isLiked) {
        // Remove user from likedBy array
        newLikedBy = newLikedBy.filter(id => id !== user.uid);
      } else {
        // Add user to likedBy array
        newLikedBy.push(user.uid);
      }
      
      await updateDoc(feedbackDocRef, {
        likes: newLikedBy.length,
        likedBy: newLikedBy
      });
      
      // Update local state
      setFeedback(prev => prev.map(fb => 
        fb.id === feedbackId 
          ? { ...fb, likes: newLikedBy.length, likedBy: newLikedBy } 
          : fb
      ));
    } catch (error) {
      console.error('Error liking feedback:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </button>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = feedback.length > 0 
    ? feedback.reduce((sum, fb) => sum + fb.rating, 0) / feedback.length 
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/student/events')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back to Events
        </button>
      </div>

      {/* Event Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img 
              src={event.image} 
              alt={event.name} 
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
          <div className="p-6 flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
            <p className="text-primary-600 font-medium mt-1">{event.club}</p>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span>{event.date ? new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                }) : 'Date not provided'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>{event.time || 'Time not provided'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span>{event.location || 'Location not provided'}</span>
              </div>
            </div>
            
            {event.description && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900">Description</h3>
                <p className="text-gray-600 mt-1">{event.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feedback Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Feedback</h2>
            
            {hasSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ThumbsUp className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Thank you!</h3>
                <p className="text-gray-600 mt-1">Your feedback has been submitted successfully.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Rating</h3>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="text-gray-300 hover:text-yellow-400 focus:outline-none"
                      >
                        <Star
                          size={32}
                          className={star <= userRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      {userRating === 1 && 'Poor'}
                      {userRating === 2 && 'Fair'}
                      {userRating === 3 && 'Good'}
                      {userRating === 4 && 'Very Good'}
                      {userRating === 5 && 'Excellent'}
                    </p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Share your experience..."
                  />
                </div>
                
                <button
                  onClick={handleSubmitFeedback}
                  disabled={submitting || userRating === 0}
                  className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    submitting || userRating === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Feedback List */}
        <div className="lg:col-span-2">
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
                  Be the first to share your experience with this event.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {feedback.map((fb) => {
                  const isLiked = fb.likedBy.includes(user?.uid || '');
                  return (
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
                          
                          <div className="mt-3 flex items-center">
                            <button
                              onClick={() => handleLikeFeedback(fb.id, fb.likedBy, isLiked)}
                              className={`flex items-center text-sm ${
                                isLiked ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              <ThumbsUp size={16} className="mr-1" />
                              {fb.likes > 0 ? fb.likes : 'Like'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFeedback;