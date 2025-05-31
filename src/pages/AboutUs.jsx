import React, { useEffect, useState } from "react";
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  Sparkles, 
  Heart, 
  Star, 
  Clock, 
  Users, 
  Award, 
  Shield, 
  ThumbsUp,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Quote,
  MapPin,
  CheckCircle2,
  Sparkles as SparklesIcon,
  Award as AwardIcon,
  Shield as ShieldIcon,
  ThumbsUp as ThumbsUpIcon,
  Users as UsersIcon,
  Star as StarIcon,
  Clock as ClockIcon,
  Heart as HeartIcon
} from 'lucide-react';

const AboutUs = () => {
  const { cartItems } = useCart();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Regular Client",
      text: "The best beauty experience I've ever had! The team at Looks N Love truly understands what makes a client feel special. Their attention to detail and personalized service is unmatched in Jamshedpur."
    },
    {
      name: "Rahul Patel",
      role: "VIP Member",
      text: "Outstanding service and attention to detail. Every visit feels like a luxury experience. The ambiance and professionalism make it worth every penny. Definitely the premium beauty destination in Jamshedpur."
    },
    {
      name: "Ananya Singh",
      role: "Beauty Enthusiast",
      text: "I love how they stay updated with the latest trends while maintaining exceptional quality. The staff's expertise and the premium products they use make every visit worthwhile. A true gem in Jamshedpur!"
    }
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollToFooter = (e) => {
    e.preventDefault();
    const footer = document.getElementById('foot');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#foot');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section with Parallax */}
      <div className="relative h-[50vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed transform hover:scale-105 transition-transform duration-[3000ms]"
          style={{
            backgroundImage: "url('/beauty-banner.png')",
            backgroundColor: "#ffe5ef",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
          <div 
            className="text-center"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              Looks N Love
            </h1>
            <div className="w-24 h-1 bg-pink-500 mx-auto mb-4" data-aos="zoom-in" data-aos-delay="200" />
            <p className="text-xl md:text-2xl mb-6 max-w-2xl px-4 leading-relaxed" data-aos="fade-up">
              Your Premier Destination for Beauty & Wellness
            </p>
          </div>
          <div 
            className="flex flex-col sm:flex-row gap-4"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Link 
              to="/#foot" 
              onClick={scrollToFooter}
              className="group bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/services" 
              className="group bg-white hover:bg-gray-100 text-pink-600 px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <span>Explore Services</span>
              <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Our Story Section with Floating Elements */}
      <div className="py-12 px-4 bg-gradient-to-b from-white to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
              }}
            />
          ))}
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Our Story</h2>
          <div className="w-20 h-1 bg-pink-500 mx-auto mb-4" data-aos="zoom-in" data-aos-delay="200" />
          <p className="text-lg text-gray-600 leading-relaxed">
            Born from a passion for beauty and wellness, Looks N Love began its journey in the heart of Jamshedpur. 
            What started as a small beauty studio has blossomed into a premier destination for those seeking to enhance 
            their natural beauty. Our commitment to excellence and personalized care has made us a trusted name in the 
            beauty industry.
          </p>
        </div>
      </div>

      {/* Mission & Core Values with 3D Cards */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800" data-aos="fade-up">
            Our Mission & Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <Sparkles className="w-12 h-12 text-pink-500" />,
                title: "Excellence",
                description: "Delivering exceptional beauty services with attention to detail"
              },
              {
                icon: <Heart className="w-12 h-12 text-pink-500" />,
                title: "Passion",
                description: "Loving what we do and sharing that joy with our clients"
              },
              {
                icon: <Star className="w-12 h-12 text-pink-500" />,
                title: "Quality",
                description: "Using premium products and maintaining high standards"
              },
              {
                icon: <Clock className="w-12 h-12 text-pink-500" />,
                title: "Reliability",
                description: "Being punctual and consistent in our service delivery"
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-500">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-base text-gray-600 text-center group-hover:text-gray-800 transition-colors duration-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-12 px-4 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800" data-aos="fade-up">
            What Our Clients Say
          </h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index}
                    className="w-full flex-shrink-0 px-4"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="bg-white p-8 rounded-2xl shadow-lg relative">
                      <div className="absolute -top-2 left-8">
                        <Quote className="w-12 h-12 text-pink-200" />
                      </div>
                      <div className="mb-6 pt-8">
                        <h3 className="text-xl font-semibold text-gray-800">{testimonial.name}</h3>
                        <p className="text-pink-600">{testimonial.role}</p>
                      </div>
                      <p className="text-lg text-gray-600 italic leading-relaxed pl-4">"{testimonial.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-pink-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-pink-600" />
            </button>
            <button 
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-pink-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-pink-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Why Choose Us with Interactive Cards */}
      <div className="py-12 px-4 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800" data-aos="fade-up">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: <UsersIcon className="w-8 h-8 text-pink-500" />,
                title: "Professional Excellence",
                points: [
                  {
                    text: "Expert team of beauty professionals",
                    icon: <SparklesIcon className="w-5 h-5 text-pink-500" />
                  },
                  {
                    text: "Regular training and skill updates",
                    icon: <AwardIcon className="w-5 h-5 text-pink-500" />
                  },
                  {
                    text: "Certified and experienced staff",
                    icon: <ShieldIcon className="w-5 h-5 text-pink-500" />
                  }
                ]
              },
              {
                icon: <AwardIcon className="w-8 h-8 text-pink-500" />,
                title: "Premium Experience",
                points: [
                  {
                    text: "Luxurious salon environment",
                    icon: <StarIcon className="w-5 h-5 text-pink-500" />
                  },
                  {
                    text: "High-quality beauty products",
                    icon: <SparklesIcon className="w-5 h-5 text-pink-500" />
                  },
                  {
                    text: "Personalized attention",
                    icon: <HeartIcon className="w-5 h-5 text-pink-500" />
                  }
                ]
              },
              {
                icon: <ShieldIcon className="w-8 h-8 text-pink-500" />,
                title: "Customer First",
                points: [
                  {
                    text: "100% satisfaction guarantee",
                    icon: <CheckCircle2 className="w-5 h-5 text-pink-500" />
                  },
                  {
                    text: "Transparent pricing",
                    icon: <AwardIcon className="w-5 h-5 text-pink-500" />
                  },
                  {
                    text: "Personalized consultations",
                    icon: <UsersIcon className="w-5 h-5 text-pink-500" />
                  }
                ]
              },
              {
                icon: <ThumbsUpIcon className="w-8 h-8 text-pink-500" />,
                title: "Convenience",
                points: [
                  {
                    text: "Easy online booking",
                    icon: <ClockIcon className="w-5 h-5 text-pink-500" />
                  },
                  {
                    text: "Flexible appointment slots",
                    icon: <StarIcon className="w-5 h-5 text-pink-500" />
                  },
                  {
                    text: "Home service options",
                    icon: <HeartIcon className="w-5 h-5 text-pink-500" />
                  }
                ]
              }
            ].map((section, index) => (
              <div 
                key={index}
                className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-pink-50 rounded-lg group-hover:bg-pink-100 transition-colors duration-300">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {section.points.map((point, i) => (
                    <li 
                      key={i} 
                      className="flex items-center gap-3 text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-300"
                    >
                      <div className="transform group-hover:scale-110 transition-transform duration-300">
                        {point.icon}
                      </div>
                      {point.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Map with Animation */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800" data-aos="fade-up">
            Service in Jamshedpur
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-pink-500" />
            <p className="text-lg text-gray-600">Online Beauty Services in Jamshedpur</p>
          </div>
          <div 
            className="w-full h-[350px] rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-500"
            data-aos="fade-up"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235013.70717383446!2d86.04927762273438!3d22.804565699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e31989f0e2b5%3A0xeeec8e81ce9b344!2sJamshedpur%2C%20Jharkhand!5e0!3m2!1sen!2sin!4v1647881234567!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Call to Action with Gradient Animation */}
      <div className="py-12 px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_200%] animate-gradient">
        <div className="max-w-4xl mx-auto text-center text-white" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Beauty Like Never Before?
          </h2>
          <p className="text-xl mb-6">
            Book your appointment today and let us help you look and feel your best.
          </p>
          <Link 
            to="/#foot" 
            onClick={scrollToFooter}
            className="inline-block bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const teamMembers = [
  {
    name: "Alice Johnson",
    role: "CEO & Founder",
    experience: 10,
    image: "review-01.jpeg",
  },
  {
    name: "Bob Smith",
    role: "Lead Developer",
    experience: 7,
    image: "review-01.jpeg",
  },
  {
    name: "Charlie Brown",
    role: "UI/UX Designer",
    experience: 5,
    image: "review-01.jpeg",
  },
  {
    name: "Diana Ross",
    role: "Marketing Head",
    experience: 8,
    image: "review-01.jpeg",
  },
];

export default AboutUs;
