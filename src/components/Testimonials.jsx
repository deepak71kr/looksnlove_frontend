import React from 'react';
import { Quote, Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "Amazing service! The team was professional and the results were outstanding. I couldn't be happier with my experience.",
      author: "Sarah M.",
      rating: 5
    },
    {
      id: 2,
      text: "Best beauty service I've ever had. The attention to detail and customer service was exceptional.",
      author: "Priya K.",
      rating: 5
    },
    {
      id: 3,
      text: "Highly recommended! The staff is friendly and the services are top-notch. Will definitely come back!",
      author: "Riya S.",
      rating: 5
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          What Our Clients Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-pink-50 rounded-2xl p-8 relative"
            >
              <Quote className="w-8 h-8 text-pink-500 mb-4" />
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800">{testimonial.author}</p>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-pink-500"
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials; 