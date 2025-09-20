import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      step: '1',
      icon: '📝',
      title: 'Create Your Entrepreneur Profile',
      description: 'Sign up and build a comprehensive profile with your business details, CIN/DIN verification, and partner preferences.'
    },
    {
      step: '2', 
      icon: '🔍',
      title: 'Get AI-Powered Matches',
      description: 'Our intelligent algorithm analyzes business compatibility, industry alignment, and personal values to find perfect matches.'
    },
    {
      step: '3',
      icon: '💬',
      title: 'Connect & Communicate',
      description: 'Reach out to compatible entrepreneurs, chat about business synergies, and build meaningful relationships.'
    },
    {
      step: '4',
      icon: '💍',
      title: 'Find Your Business Partner for Life',
      description: 'Meet your ideal entrepreneur partner who shares your vision, values, and dreams of building something great together.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How Entrepreneur Shaadi Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find your perfect business and life partner in 4 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12 lg:space-y-0">
          {steps.map((step, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Visual */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} flex justify-center`}>
                <div className="w-full max-w-md h-64 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-8xl mb-4">{step.icon}</div>
                    <div className="text-6xl font-bold text-red-600">
                      {step.step}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-4 rounded-lg font-bold text-xl hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-lg">
            Start Your Journey Today
          </button>
          <p className="text-gray-500 mt-4">
            Join thousands of entrepreneurs who found their perfect match
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;