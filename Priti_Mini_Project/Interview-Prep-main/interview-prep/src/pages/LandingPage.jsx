import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import HeroImage from "../assets/Images/LandingPage.png";
import ResumeImage from "../assets/Images/Resume.png";
import Carousel from "../components/Carousel";
import SplitText from "../components/SplitText";
import { Star, Zap } from "lucide-react";

const LandingPage = () => {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 flex flex-col items-center px-4 py-6 sm:px-8 sm:py-8">
        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-gray-100 via-purple-200 to-blue-100 shadow-xl rounded-2xl w-full max-w-[90%] mx-auto flex flex-col md:flex-row items-center p-6 md:p-12 z-10">
          {/* Left Content */}
          <div className="w-full md:w-3/5 text-center md:text-left space-y-6 md:pr-8 lg:pr-12">
            <SplitText
              text="Oh hello, diamond in the rough!"
              className="font-bold text-3xl md:text-4xl lg:text-5xl text-purple-800 whitespace-nowrap"
              delay={150}
              animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
              animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
              easing="easeOutCubic"
              threshold={0.2}
              rootMargin="-50px"
              onLetterAnimationComplete={handleAnimationComplete}
            />
            <p className="text-lg text-gray-700 md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0">
              This website won’t teach you how to make Maggi{" "}
              <span role="img" aria-label="noodles">
                🍜
              </span>
              , but if you want to ace your interviews or take your skills to the next level, you’ve come to the perfect place.{" "}
              <span role="img" aria-label="sparkles">
                🌟
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
              <Link to="/dashboard">
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                  aria-label="Get started with interview preparation"
                >
                  Let's Start
                </button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-2/5 flex justify-center mt-8 md:mt-0">
            <img
              src={HeroImage}
              alt="Career success illustration"
              className="w-full max-w-md rounded-xl shadow-xl hover:shadow-blue-300 transition-shadow duration-300"
              loading="lazy"
            />
          </div>
        </div>

        {/* Carousel Section Heading */}
        <div className="w-full max-w-[90%] mx-auto mt-16 mb-8 text-center">
          <h2 className="inline-block text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <span className="border-b-4 border-yellow-400 pb-2">Interview Preparation Steps</span>
          </h2>
        </div>

        {/* Carousel Section */}
        <div className="w-full max-w-[90%] mx-auto">
          <Carousel />
        </div>

        {/* Resume Section Heading */}
        <div className="w-full max-w-[90%] mx-auto mt-16 mb-8 text-center">
          <h2 className="inline-block text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <span className="border-b-4 border-yellow-400 pb-2">Build Your Perfect Resume</span>
          </h2>
        </div>

        {/* Resume Section */}
        <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 shadow-2xl hover:shadow-3xl transition-shadow duration-300 rounded-2xl w-full max-w-[90%] mx-auto flex flex-col md:flex-row items-center p-6 md:p-12 mt-8 z-10 overflow-hidden">
          {/* Floating elements background */}
          <div className="absolute inset-0">
            <div className="absolute w-24 h-24 bg-white/10 rounded-full -top-6 -left-6 animate-float"></div>
            <div className="absolute w-32 h-32 bg-white/5 rounded-full -bottom-12 -right-12 animate-float-delayed"></div>
            <div className="absolute w-48 h-48 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full top-1/4 -right-24 animate-float"></div>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-2/5 flex justify-center mt-6 md:mt-0 relative z-10">
            <img
              src={ResumeImage}
              alt="Resume preview example"
              className="w-full max-w-md rounded-xl transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl border-4 border-white/20"
              loading="lazy"
            />
            <div className="absolute -bottom-4 -right-4 bg-yellow-400 px-4 py-2 rounded-lg shadow-lg animate-bounce">
              <span className="font-bold text-purple-900">NEW!</span>
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full md:w-3/5 text-center md:text-left space-y-6 pl-0 md:pl-12 relative z-10 mt-8 md:mt-0">
            <div className="inline-block bg-white/10 px-6 py-2 rounded-full mb-4 backdrop-blur-sm">
              <span className="text-sm font-semibold text-yellow-400">🚀 Career Accelerator</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Unlock Your{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent block md:inline">
                Dream Career
              </span>{" "}
              !!
            </h2>

            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto md:mx-0">
              Build your resume by filling forms with our AI-powered guidance system!
            </p>

            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <Link to="/resume">
                <button
                  className="group bg-yellow-400 hover:bg-yellow-500 text-purple-900 px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
                  aria-label="Create Now"
                >
                  Create Now
                </button>
              </Link>
            </div>

            {/* Achievement Badges */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-white text-sm">Career Boost Guarantee</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-white text-sm">AI-Powered Insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
