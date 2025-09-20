import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Assisted Matching',
      subtitle: 'Personalized entrepreneur matchmaking service',
      description: 'Find your match 10x faster with our intelligent matching algorithm',
      benefits: [
        'Business compatibility analysis',
        'Industry expertise matching',
        'Investment stage alignment',
        'Vision and values matching'
      ],
      bgColor: 'bg-blue-50',
      accentColor: 'text-blue-600'
    },
    {
      icon: '👑',
      title: 'Elite Entrepreneur Network',
      subtitle: 'The largest and most successful matrimony service for business elites',
      description: 'Connect with verified founders, CEOs, and industry leaders',
      benefits: [
        'Largest pool of truly elite entrepreneur profiles',
        'Experienced Relationship Managers',
        '100% confidential service',
        'Exclusive networking opportunities'
      ],
      bgColor: 'bg-purple-50',
      accentColor: 'text-purple-600'
    },
    {
      icon: '🏪',
      title: 'Entrepreneur Shaadi Centers',
      subtitle: 'Visit your nearest center for personalized assistance',
      description: 'Get expert help with profile creation and partner selection',
      benefits: [
        'Registering your entrepreneur profile',
        'Business compatibility assessment',
        'Enhancing your professional portfolio',
        'Secure payment processing'
      ],
      bgColor: 'bg-green-50',
      accentColor: 'text-green-600'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${feature.bgColor} rounded-3xl p-8 lg:p-12`}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className="text-5xl mr-4">{feature.icon}</div>
                    <div>
                      <h3 className={`text-2xl lg:text-3xl font-bold ${feature.accentColor} mb-2`}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-700 font-medium">
                        {feature.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center">
                        <div className={`w-6 h-6 rounded-full ${feature.accentColor.replace('text-', 'bg-')} flex items-center justify-center mr-3`}>
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className={`mt-8 ${feature.accentColor.replace('text-', 'bg-')} text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}>
                    Learn More →
                  </button>
                </div>
                
                {/* Image Placeholder */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} flex justify-center`}>
                  <div className="w-full max-w-md h-64 lg:h-80 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{feature.icon}</div>
                      <div className={`text-xl font-bold ${feature.accentColor}`}>
                        {feature.title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;