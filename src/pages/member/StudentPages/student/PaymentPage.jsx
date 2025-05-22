import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import Navbar from '../../components/layout/Navbar';
import PaymentForm from '../../components/payment/PaymentForm';

const PaymentPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { allClubs } = useStudent();
  
  // Get information based on type and id
  const getPaymentInfo = () => {
    if (type === 'membership') {
      const club = allClubs.find(club => club.id === id);
      
      if (!club) {
        return {
          exists: false,
          name: 'Unknown Club',
          amount: 0,
          returnUrl: '/memberships'
        };
      }
      
      return {
        exists: true,
        name: `${club.name} Membership`,
        amount: 25, // In a real app, this would come from the club data
        returnUrl: `/club/${id}`
      };
    }
    
    if (type === 'event') {
      // For event registration
      return {
        exists: true,
        name: 'Event Registration',
        amount: 10,
        returnUrl: `/event/${id}`
      };
    }
    
    return {
      exists: false,
      name: 'Unknown Item',
      amount: 0,
      returnUrl: '/dashboard'
    };
  };
  
  const paymentInfo = getPaymentInfo();
  
  if (!paymentInfo.exists) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Payment Request</h1>
          <p className="text-gray-600 mb-8">The payment you're trying to make doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </button>
          
          <PaymentForm 
            amount={paymentInfo.amount} 
            itemName={paymentInfo.name} 
            returnUrl={paymentInfo.returnUrl}
          />
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;