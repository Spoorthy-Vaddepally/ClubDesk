import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, Check } from 'lucide-react';

const PaymentForm = ({ amount, itemName, returnUrl }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'number') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setCardDetails({
        ...cardDetails,
        [name]: formattedValue,
      });
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiry') {
      const cleanValue = value.replace(/\D/g, '');
      let formattedValue = cleanValue;
      
      if (cleanValue.length > 2) {
        formattedValue = `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
      }
      
      setCardDetails({
        ...cardDetails,
        [name]: formattedValue,
      });
      return;
    }
    
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate card number - just a basic check for demo
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length !== 16) {
      newErrors.number = 'Please enter a valid 16-digit card number';
    }
    
    // Validate name
    if (!cardDetails.name.trim()) {
      newErrors.name = 'Please enter the cardholder name';
    }
    
    // Validate expiry
    if (!cardDetails.expiry || cardDetails.expiry.length !== 5) {
      newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
    }
    
    // Validate CVC
    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid security code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      if (!validateForm()) {
        return;
      }
      
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        handlePaymentSuccess();
      }, 1500);
    } else if (paymentMethod === 'qr') {
      setShowQRCode(true);
    }
  };
  
  const handlePaymentSuccess = () => {
    // Show success message and navigate back
    alert('Payment successful!');
    navigate(returnUrl);
  };
  
  const togglePaymentMethod = (method) => {
    setPaymentMethod(method);
    setShowQRCode(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold mb-6">Payment</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Amount</h3>
          <span className="text-2xl font-bold text-primary-600">${amount}</span>
        </div>
        <p className="text-gray-600 text-sm">{itemName}</p>
      </div>
      
      <div className="mb-6">
        <div className="flex border border-gray-200 rounded-lg mb-4">
          <button
            type="button"
            className={`flex-1 py-3 flex justify-center items-center gap-2 ${
              paymentMethod === 'card'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => togglePaymentMethod('card')}
          >
            <CreditCard size={18} />
            <span>Card Payment</span>
          </button>
          <button
            type="button"
            className={`flex-1 py-3 flex justify-center items-center gap-2 ${
              paymentMethod === 'qr'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => togglePaymentMethod('qr')}
          >
            <QrCode size={18} />
            <span>QR Payment</span>
          </button>
        </div>
      </div>
      
      {paymentMethod === 'card' && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                id="number"
                name="number"
                value={cardDetails.number}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.number ? 'border-red-300' : 'border-gray-300'
                }`}
                maxLength="19"
              />
              {errors.number && (
                <p className="mt-1 text-sm text-red-600">{errors.number}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={cardDetails.name}
                onChange={handleInputChange}
                placeholder="John Smith"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.expiry ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength="5"
                />
                {errors.expiry && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  name="cvc"
                  value={cardDetails.cvc}
                  onChange={handleInputChange}
                  placeholder="123"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.cvc ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength="4"
                />
                {errors.cvc && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>
                )}
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full mt-6 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center transition-colors duration-150"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-pulse flex items-center">
                <span className="mr-2">Processing</span>
                <span className="h-2 w-2 bg-white rounded-full mx-0.5 animate-pulse"></span>
                <span className="h-2 w-2 bg-white rounded-full mx-0.5 animate-pulse delay-100"></span>
                <span className="h-2 w-2 bg-white rounded-full mx-0.5 animate-pulse delay-200"></span>
              </div>
            ) : (
              <>
                <span>Pay ${amount}</span>
              </>
            )}
          </button>
        </form>
      )}
      
      {paymentMethod === 'qr' && (
        <div className="text-center">
          {!showQRCode ? (
            <>
              <p className="mb-4 text-gray-600">
                Scan a QR code with your mobile banking app to make a payment.
              </p>
              <button
                onClick={handleSubmit}
                className="w-full mt-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center transition-colors duration-150"
              >
                <span>Show QR Code</span>
              </button>
            </>
          ) : (
            <div className="animate-fadeIn">
              <div className="bg-gray-100 p-4 rounded-lg mb-4 mx-auto max-w-xs">
                {/* This would be a real QR code in production */}
                <div className="aspect-square w-full bg-white p-4 rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="bg-black"></div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Scan this QR code with your banking app to pay ${amount} for {itemName}
              </p>
              
              <button
                onClick={handlePaymentSuccess}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center transition-colors duration-150"
              >
                <Check size={18} className="mr-2" />
                <span>I've Completed the Payment</span>
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>Your payment information is encrypted and secure.</p>
      </div>
    </div>
  );
};

export default PaymentForm;