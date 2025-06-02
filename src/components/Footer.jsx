import { useState, useEffect } from "react";
import axios from "axios";
import { FaWhatsapp, FaFacebook, FaInstagram, FaUser, FaPhone, FaCalendarAlt, FaClock, FaInfoCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context/AuthContext";
import { X, CheckCircle2, MessageSquare } from 'lucide-react';

// Helper to get today's date as a JS Date object
function getTodayDateObj() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// Helper to get the nearest upcoming 2-hour slot from 8am to 10pm
function getUpcomingTimeSlot() {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 8) return "8am - 10am";
  if (hour < 10) return "10am - 12pm";
  if (hour < 12) return "12pm - 2pm";
  if (hour < 14) return "2pm - 4pm";
  if (hour < 16) return "4pm - 7pm";
  if (hour < 18) return "6pm - 8pm";
  if (hour < 20) return "8pm - 10pm";
  // If it's 10pm or later, default to first slot tomorrow
  return "8am - 10am";
}

const timeSlots = [
  "8am - 10am",
  "10am - 12pm",
  "12pm - 2pm",
  "2pm - 4pm",
  "4pm - 6pm",
  "6pm - 8pm",
  "8pm - 10pm",
];

const Footer = () => {
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    message: "",
  });
  const [deliveryDate, setDeliveryDate] = useState(getTodayDateObj());
  const [deliveryTime, setDeliveryTime] = useState(getUpcomingTimeSlot());
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [error, setError] = useState(null);

  // Auto-fill form when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm(prevForm => ({
        ...prevForm,
        name: user.name || "",
        phone: user.phone || ""
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = deliveryDate
      ? deliveryDate.toISOString().split("T")[0]
      : "";
    const data = {
      ...form,
      date: formattedDate,
      time: deliveryTime,
    };
    try {
      await axios.post("/api/contact", data);
      setShowSuccessDialog(true);
      setForm({ name: "", phone: "", message: "" });
      setDeliveryDate(getTodayDateObj());
      setDeliveryTime(getUpcomingTimeSlot());
    } catch (err) {
      setError("Failed to book appointment. Please try again.");
    }
  };

  return (
    <footer
      id="foot"
      className="relative bg-customPink bg-cover bg-center text-white py-10 px-5"
      style={{
        backgroundImage: "url('/beauty-banner.png')",
        backgroundColor: "#ffe5ef",
      }}
    >
      {/* Overlay for background tint if needed */}
      <div className="absolute inset-0 bg-customPink-20 bg-opacity-60 pointer-events-none"></div>

      <div className="relative max-w-3xl ml-auto text-black pr-2 sm:pr-10">
        <h2 className="text-4xl font-bold mb-6 text-pink-700 drop-shadow-lg text-right">
          Contact Us
        </h2>

        {/* Success Dialog */}
        {showSuccessDialog && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1003]"
            data-aos="fade-up"
            data-aos-duration="500"
          >
            <div 
              className="bg-white rounded-2xl p-8 max-w-md w-full relative transform transition-all"
              data-aos="zoom-in"
              data-aos-duration="500"
              data-aos-delay="200"
            >
              <div className="absolute -top-4 -right-4">
                <button
                  onClick={() => setShowSuccessDialog(false)}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-110 duration-200"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 hover:scale-110">
                  <CheckCircle2 size={40} className="text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Appointment Booked!
                </h3>
                <p className="text-gray-600 text-lg mb-6">
                  Your appointment has been scheduled successfully
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowSuccessDialog(false)}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-[1001]">
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="flex justify-end space-x-6 mb-6">
          <a
            href="https://wa.me/919508387371"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl hover:text-green-500"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://www.facebook.com/your-group"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl hover:text-blue-500"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl hover:text-pink-500"
          >
            <FaInstagram />
          </a>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-4 rounded-xl shadow-lg px-4 py-6 md:px-8 md:py-8 max-w-md w-full ml-auto"
          style={{
            background: "rgba(255,255,255,0.2)",
            minWidth: "260px",
          }}
        >
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-white text-black focus:ring-2 focus:ring-pink-500"
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-white text-black focus:ring-2 focus:ring-pink-500"
          />

          {/* Date & Time in a single row, same height */}
          <div className="flex flex-col sm:flex-row w-full gap-0 sm:gap-2">
            {/* Date Picker */}
            <div className="w-full sm:w-1/2">
              <DatePicker
                selected={deliveryDate}
                onChange={(date) => setDeliveryDate(date)}
                minDate={getTodayDateObj()}
                dateFormat="dd/MM/yyyy"
                className="input input-bordered w-full bg-white text-black text-sm md:text-base focus:ring-2 focus:ring-pink-500 h-12 "
                calendarClassName="text-black"
                popperPlacement="bottom"
                placeholderText="Select Delivery Date"
                style={{
                  borderRight: "none",
                  color: deliveryDate ? "#111827" : "#9ca3af",
                }}
              />
            </div>
            {/* Time Picker */}
            <div className="w-full sm:w-1/2">
              <select
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                required
                className="rounded-b-lg sm:rounded-b-none sm:rounded-r-lg border border-gray-300 p-2 w-full bg-white text-sm md:text-base focus:ring-2 focus:ring-pink-500 h-12"
                style={{
                  color: deliveryTime ? "#111827" : "#9ca3af",
                }}
              >
                {!deliveryTime && (
                  <option value="" disabled>
                    Select Delivery Time
                  </option>
                )}
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-white text-black focus:ring-2 focus:ring-pink-500 h-24"
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 w-full py-3 bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold rounded-full shadow-lg transition duration-300"
          >
            Book an Appointment
          </button>
        </form>

        <div className="mt-6">
          <img src="/logo.jpeg" alt="Website Logo" className="ml-auto h-16" />
        </div>

        <p className="mt-4 text-gray-400">&copy; LooksnLove 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
