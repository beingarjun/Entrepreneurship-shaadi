import React from 'react';

const StatsSection = () => {
  const stats = [
    {
      icon: '🏆',
      number: '100%',
      text: 'CIN/DIN-verified profiles',
      badge: 'Verified'
    },
    {
      icon: '👥',
      number: '10 Crore+',
      text: 'Entrepreneurs served',
      badge: 'Growing'
    },
    {
      icon: '📅',
      number: '3 Years',
      text: 'of successful matchmaking',
      badge: 'Record'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-red-600 to-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="text-4xl mr-3">{stat.icon}</div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold">{stat.number}</div>
                  <div className="inline-flex items-center">
                    <span className="text-red-200 text-sm lg:text-base">{stat.text}</span>
                    <span className="ml-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                      {stat.badge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-6 py-3">
            <span className="text-2xl mr-3">🏅</span>
            <div className="text-white">
              <div className="font-bold">Lakhs of Happy Marriages!</div>
              <div className="text-red-100 text-sm">
                Featured in the Limca Book of Records for highest number of documented marriages online
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;