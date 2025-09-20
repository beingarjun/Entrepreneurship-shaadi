import React, { useState } from 'react';
import Link from 'next/link';

const HeroSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    gender: '',
    profileFor: 'myself'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration
    console.log('Registration data:', formData);
  };

  return (
    <div className="relative bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden">
      {/* Header */}
      <header className="relative bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-600">
                Entrepreneur Shaadi
              </h1>
              <span className="ml-2 text-sm text-gray-500">®</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/search" className="text-gray-600 hover:text-red-600 transition-colors">
                Search
              </Link>
              <Link href="/browse" className="text-gray-600 hover:text-red-600 transition-colors">
                Browse Profiles
              </Link>
              <Link href="/success" className="text-gray-600 hover:text-red-600 transition-colors">
                Success Stories
              </Link>
              <Link href="/help" className="text-gray-600 hover:text-red-600 transition-colors">
                Help
              </Link>
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                LOGIN
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  25 Years of Successful Matchmaking
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  The biggest and most{' '}
                  <span className="text-red-600">trusted</span>
                  <br />
                  matrimony service for{' '}
                  <span className="text-red-600">Entrepreneurs!</span>
                </h1>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-red-600">100%</div>
                  <div className="text-sm text-gray-600">CIN/DIN verified profiles</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-red-600">10,000+</div>
                  <div className="text-sm text-gray-600">Entrepreneurs served</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-red-600">3 Years</div>
                  <div className="text-sm text-gray-600">of successful matchmaking</div>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <p className="text-lg text-gray-600 mb-6">
                  <span className="font-semibold">Lakhs of Happy Partnerships!</span>
                  <br />
                  Featured in the Business Record for highest number of documented 
                  entrepreneur marriages online
                </p>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Find your perfect match
                </h2>
                <p className="text-gray-600">Entrepreneur profile for</p>
              </div>

              {/* Profile For Selection */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {['Myself', 'Daughter', 'Son'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData(prev => ({ ...prev, profileFor: option.toLowerCase() }))}
                    className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                      formData.profileFor === option.toLowerCase()
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-red-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {['Sister', 'Brother', 'Relative'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData(prev => ({ ...prev, profileFor: option.toLowerCase() }))}
                    className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                      formData.profileFor === option.toLowerCase()
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-red-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                
                <input
                  type="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  REGISTER FREE! 🎉
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  *By clicking register free, I agree to the{' '}
                  <Link href="/terms" className="text-red-600 hover:underline">
                    T&C
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-red-600 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;