import React from 'react';
import { Mail, Phone, Send, Linkedin, Github, Facebook, Instagram } from 'lucide-react';
import Header from '../components/Header';

const Contact = () => {
  const contactMethods = [
    {
      icon: <Mail className="w-10 h-10 text-blue-600" />, 
      title: "Email Us", 
      description: "Have questions? We're here to help", 
      details: "preppathsupport@gmail.com"
    },
    {
      icon: <Phone className="w-10 h-10 text-blue-600" />, 
      title: "Call Us", 
      description: "Mon-Fri from 9am to 5pm", 
      details: "+91 81049 35305"
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="text-center py-20 px-4 bg-gradient-to-br from-purple-700 via-blue-300 to-indigo-700 text-purple-900">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl font-semibold md:text-2xl text-black max-w-3xl mx-auto">
            Have questions? Reach out to us and we'll be happy to assist you!
          </p>
        </section>

        {/* Contact Methods Grid */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How to Reach Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-shadow ring-2 ring-blue-300 text-center"
              >
                <div className="mb-4 flex justify-center">{method.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {method.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {method.description}
                </p>
                <p className="text-gray-900 font-medium mt-2">{method.details}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-black">
              Send Us a Message
            </h2>
            <div className="bg-white p-10 rounded-xl shadow-blue-500 shadow-2xl ring-2 ring-blue-300 max-w-2xl mx-auto">
              <form className="space-y-6">
                <input type="text" placeholder="Full Name" className="w-full px-5 py-4 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                <input type="email" placeholder="Email Address" className="w-full px-5 py-4 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                <textarea rows="4" placeholder="Your Message" className="w-full px-5 py-4 border rounded-lg focus:ring-2 focus:ring-purple-500"></textarea>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center text-lg shadow-md">
                  <Send className="w-5 h-5 mr-2" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Social Links (Bottom Section) */}
        <div className="flex flex-col items-center justify-center py-10 bg-gradient-to-br from-purple-500 via-blue-300 to-indigo-500 text-black">
          <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
          <div className="flex space-x-6">
            <a href="#" className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="#" className="p-4 bg-gray-800 hover:bg-gray-900 text-white rounded-full shadow-lg">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="p-4 bg-blue-800 hover:bg-blue-900 text-white rounded-full shadow-lg">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="p-4 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-lg">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
