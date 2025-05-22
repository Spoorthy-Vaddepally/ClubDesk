import React from 'react';
import { Award, CheckCircle } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import Navbar from '../../components/layout/Navbar';
import CertificateCard from '../../components/certificates/CertificateCard';

const Certificates = () => {
  const { certificates, pastEvents } = useStudent();
  
  // Find events that have certificates available but the user hasn't claimed yet
  const availableCertificates = pastEvents.filter(
    event => 
      event.certificateAvailable && 
      !certificates.some(cert => cert.eventId === event.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Your Certificates
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Download and manage certificates for events you've attended
              </p>
            </div>
          </div>
          
          {/* Available certificates section */}
          {availableCertificates.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Certificates Available to Claim
              </h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {availableCertificates.map(event => (
                  <div key={event.id} className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <div className="text-white">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <p className="text-sm opacity-90">{event.clubName}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="h-5 w-5 mr-1.5 text-green-500" />
                          <span>Certificate Available</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <button
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                      >
                        <Award className="mr-2 h-4 w-4" />
                        Claim Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* My certificates section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              My Certificates
            </h2>
            
            {certificates.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  You haven't earned any certificates yet. Attend events to earn certificates for your participation.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certificates.map(certificate => (
                  <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Certificates;