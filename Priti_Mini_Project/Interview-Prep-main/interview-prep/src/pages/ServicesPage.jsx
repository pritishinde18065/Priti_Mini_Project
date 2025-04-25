import { Briefcase, Bot, Video, Star, Zap, ShieldCheck } from 'lucide-react';
import Carousel from '../components/Carousel'; 
import Header from '../components/Header';

const Services = () => {
  const features = [
    {
      icon: <Briefcase size={40} className="text-blue-600" />,
      title: "AI-Powered Mock Interviews",
      description: "Practice with realistic interviews as per your target job role and experience level."
    },
    {
      icon: <Bot size={40} className="text-blue-600" />,
      title: "Smart Feedback System",
      description: "Get instant analysis on your answers."
    },
    {
      icon: <Video size={40} className="text-blue-600" />,
      title: "Video Recording & Playback",
      description: "Record your practice sessions and review them to see your performance."
    },
    {
      icon: <Star size={40} className="text-blue-600" />,
      title: "New Questions Everytime",
      description: "Get New Challenges everytime to improve your skills."
    },
    {
      icon: <Zap size={40} className="text-blue-600" />,
      title: "Real-time Practice",
      description: "Instant voice-to-text analysis with follow-up questions during mock sessions."
    },
    {
      icon: <ShieldCheck size={40} className="text-blue-600" />,
      title: "Secure & Private",
      description: "All sessions are encrypted and completely private to you."
    }
  ];

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Master Your Next Interview
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
          AI-powered interview coaching with real-time feedback and personalized guidance
        </p>
      </section>

      {/* Key Features Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose Our Platform?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-shadow ring-2 ring-blue-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          <Carousel /> {/* Reuse your existing carousel component */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Start Your Success Journey Today
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who landed their dream jobs with our AI coaching
        </p>
      </section>
    </div>
    </>
  );
};

export default Services;
