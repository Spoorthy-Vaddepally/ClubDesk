import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { register } from 'swiper/element/bundle';

const EventSlider = ({ events }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Register Swiper web component
    register();
    
    // Initialize swiper
    const swiperEl = document.querySelector('swiper-container');
    
    if (swiperEl) {
      const swiperParams = {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
      };

      // Assign parameters
      Object.assign(swiperEl, swiperParams);
      
      // Initialize swiper
      swiperEl.initialize();
    }
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle click on event card
  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <swiper-container init={false} className="mySwiper">
        {events.map(event => (
          <swiper-slide key={event.id}>
            <div 
              className="relative group rounded-xl overflow-hidden shadow-md h-[380px] cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
              
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <div className="flex items-center mb-2">
                  <img 
                    src={event.clubLogo} 
                    alt={event.clubName} 
                    className="w-8 h-8 rounded-full object-cover mr-2 border-2 border-white"
                  />
                  <span className="text-sm font-medium opacity-90">{event.clubName}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                
                <p className="text-sm opacity-90 line-clamp-2 mb-3">
                  {event.description}
                </p>
                
                <div className="flex flex-wrap text-xs opacity-75 gap-x-4 gap-y-2">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>

                <div className="mt-4">
                  {event.isAttending ? (
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      You're attending
                    </span>
                  ) : (
                    <button 
                      className="px-3 py-1 text-xs font-medium rounded-full bg-white text-primary-700 hover:bg-primary-50 transition-colors duration-200"
                    >
                      Register now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </swiper-slide>
        ))}
      </swiper-container>
    </div>
  );
};

export default EventSlider;