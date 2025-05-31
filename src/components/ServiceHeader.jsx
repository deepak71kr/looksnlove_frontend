import React, { useState, useEffect } from "react";

// Add font imports at the top
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&display=swap');
`;

const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg min-w-[45px] text-center">
          <span className="text-lg font-bold text-white font-['Poppins']">{value}</span>
        </div>
      </div>
      <span className="text-white/80 text-xs mt-1 font-['Poppins']">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center space-x-3">
      <span className="text-white/90 text-sm font-medium tracking-wide font-['Poppins']">Ends in</span>
      <div className="flex space-x-2">
        <TimeBox value={timeLeft.days} label="Days" />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <TimeBox value={timeLeft.minutes} label="Mins" />
        <TimeBox value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};

const ServiceHeader = ({ offer }) => {
  return (
    <div className="relative my-8 md:my-12">
      <style>{fontStyles}</style>
      {/* Offer Content */}
      {offer && (
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6">
          {/* Concentric Borders Container */}
          <div className="relative">
            {/* Outer Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/40 to-purple-500/40 rounded-2xl"></div>
            {/* Second Border */}
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl"></div>
            {/* Third Border */}
            <div className="absolute -inset-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl"></div>
            {/* Fourth Border */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl"></div>

            {/* Main Content */}
            <div className="relative overflow-hidden rounded-xl shadow-xl">
              {/* Main Container with Gradient Background */}
              <div className="relative bg-gradient-to-r from-pink-600 to-purple-600">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  {/* Left Side - Content */}
                  <div className="relative p-6 md:p-8">
                    {/* Flash Sale Badge */}
                    <div className="inline-block relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full blur-md"></div>
                      <div className="relative bg-gradient-to-r from-yellow-400 to-pink-500 px-4 py-1 rounded-full">
                        <span className="text-white text-sm font-bold tracking-wider flex items-center font-['Poppins']">
                          <span className="animate-pulse">⚡</span>
                          <span className="mx-2">FLASH SALE</span>
                          <span className="animate-pulse">⚡</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* Discount Amount */}
                    <div className="relative mb-4">
                      <h2 className="text-4xl md:text-5xl font-black text-white mb-1 leading-none tracking-tighter font-['Playfair_Display']">
                        <span className="relative inline-block">
                          <span className="absolute -inset-1 bg-white/20 rounded-lg blur"></span>
                          <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-white">
                            {offer.amount}
                            <span className="text-3xl md:text-4xl font-black">%</span>
                          </span>
                        </span>
                        <span className="block text-2xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-white tracking-widest font-['Playfair_Display']">
                          OFF
                        </span>
                      </h2>
                    </div>

                    {/* Service Name */}
                    <div className="relative mb-4">
                      <p className="text-xl text-white font-bold tracking-wide font-['Playfair_Display']">
                        <span className="relative inline-block">
                          <span className="absolute -inset-1 bg-white/20 rounded-lg blur"></span>
                          <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-white uppercase tracking-wider">
                            {offer.serviceName}
                          </span>
                        </span>
                      </p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="relative">
                      <div className="absolute -inset-2 bg-white/10 rounded-lg blur"></div>
                      <div className="relative">
                        <CountdownTimer endDate={offer.endDate} />
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Image */}
                  <div className="relative h-48 md:h-auto">
                    <div className="absolute inset-0">
                      <img
                        src="/categories_images/premium_services.jpg"
                        alt="Beauty Services"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-l from-pink-600/50 to-purple-600/50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceHeader; 