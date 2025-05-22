import React from 'react';
import { Download, Calendar, Award } from 'lucide-react';

const CertificateCard = ({ certificate }) => {
  const handleDownload = (e) => {
    e.preventDefault();
    // In a real app, this would trigger the download of the certificate
    alert('Download started for certificate');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-200">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={certificate.imageUrl} 
          alt={certificate.eventName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <div className="text-white">
            <h3 className="font-bold text-lg">{certificate.eventName}</h3>
            <p className="text-sm opacity-90">{certificate.clubName}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Award size={16} className="mr-1.5" />
            <span>Certificate of Completion</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-1.5" />
            <span>{new Date(certificate.issueDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Download size={16} className="mr-2" />
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;