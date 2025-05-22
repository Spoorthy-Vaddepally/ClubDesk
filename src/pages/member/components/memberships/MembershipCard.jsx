import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, RefreshCw } from 'lucide-react';

const MembershipCard = ({ membership }) => {
  const navigate = useNavigate();

  // Calculate days remaining until expiry
  const calculateDaysRemaining = () => {
    const today = new Date();
    const expiryDate = new Date(membership.expiryDate);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 30;

  const handleRenew = () => {
    navigate(`/payment/membership/${membership.clubId}`);
  };

  return (
    <div className={`bg-white rounded-xl border overflow-hidden shadow-sm transition-all duration-200 ${
      membership.status === 'active' 
        ? 'border-primary-200' 
        : 'border-gray-200'
    }`}>
      <div className="relative">
        <div className="absolute top-0 right-0 m-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            membership.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {membership.status === 'active' ? 'Active' : 'Expired'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img 
              src={membership.clubLogo} 
              alt={membership.clubName} 
              className="h-14 w-14 rounded-lg object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{membership.clubName}</h3>
            <p className="text-sm text-gray-600">{membership.membershipType} Membership</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2 text-gray-400" />
            <span>Joined: {new Date(membership.joinDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2 text-gray-400" />
            <span>
              Expires: {new Date(membership.expiryDate).toLocaleDateString()}
              {isExpiringSoon && membership.status === 'active' && (
                <span className="ml-2 text-amber-600 font-medium">
                  ({daysRemaining} days left)
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <CreditCard size={16} className="mr-2 text-gray-400" />
            <span>Fee: ${membership.membershipFee}</span>
          </div>
        </div>

        <div className="mt-5">
          {membership.status === 'expired' ? (
            <button 
              onClick={handleRenew}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              <RefreshCw size={16} className="mr-2" />
              Renew Membership
            </button>
          ) : (
            isExpiringSoon && (
              <button 
                onClick={handleRenew}
                className="w-full flex items-center justify-center px-4 py-2 border border-primary-300 rounded-md shadow-sm text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none"
              >
                <RefreshCw size={16} className="mr-2" />
                Renew Early
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;