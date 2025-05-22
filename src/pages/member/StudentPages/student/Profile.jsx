import React, { useState } from 'react';
import { User, Mail, Award, Building, BookOpen, Tag, Save } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import Navbar from '../../components/layout/Navbar';

const Profile = () => {
  const { studentInfo } = useStudent();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: studentInfo.name,
    email: studentInfo.email,
    university: studentInfo.university,
    department: studentInfo.department,
    year: studentInfo.year,
    interests: [...studentInfo.interests]
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleInterestChange = (e, index) => {
    const newInterests = [...formData.interests];
    newInterests[index] = e.target.value;
    setFormData({
      ...formData,
      interests: newInterests
    });
  };
  
  const handleAddInterest = () => {
    setFormData({
      ...formData,
      interests: [...formData.interests, '']
    });
  };
  
  const handleRemoveInterest = (index) => {
    const newInterests = [...formData.interests];
    newInterests.splice(index, 1);
    setFormData({
      ...formData,
      interests: newInterests
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would update the profile via an API call
    setIsEditing(false);
    
    // For demo purposes
    alert('Profile updated successfully!');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Your Profile
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="mt-4 flex md:mt-0">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img 
                    className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-sm"
                    src={studentInfo.profileImage}
                    alt={studentInfo.name}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {studentInfo.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {studentInfo.department}, {studentInfo.university}
                  </p>
                </div>
              </div>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                      University
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="university"
                        id="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="department"
                        id="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                      Year
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                      <option value={5}>5th Year</option>
                      <option value={6}>Postgraduate</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
                      Interests
                    </label>
                    <p className="mt-1 text-sm text-gray-500">
                      List your interests to discover clubs and events that match them.
                    </p>
                    <div className="mt-2 space-y-2">
                      {formData.interests.map((interest, index) => (
                        <div key={index} className="flex items-center">
                          <div className="relative flex-grow rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Tag className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={interest}
                              onChange={(e) => handleInterestChange(e, index)}
                              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                              placeholder="e.g., Photography, Music, Science"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveInterest(index)}
                            className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                          >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddInterest}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        <svg className="mr-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Interest
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <User className="h-5 w-5 mr-2 text-gray-400" />
                      Full Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{studentInfo.name}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-gray-400" />
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{studentInfo.email}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-gray-400" />
                      University
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{studentInfo.university}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-gray-400" />
                      Department & Year
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{studentInfo.department}, Year {studentInfo.year}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Tag className="h-5 w-5 mr-2 text-gray-400" />
                      Interests
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <div className="flex flex-wrap gap-2">
                        {studentInfo.interests.map((interest, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
          
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100 mt-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-100">
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary-500" />
                Achievements
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your participation certificates and awards.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm text-gray-500">
                You don't have any achievements yet. Participate in events to earn certificates and awards.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;