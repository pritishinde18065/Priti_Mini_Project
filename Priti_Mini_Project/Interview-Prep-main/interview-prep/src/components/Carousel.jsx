import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Img1 from "../assets/Images/Step1.png";
import Img2 from "../assets/Images/Step2.png";
import Img3 from "../assets/Images/Step3.png";
import Img4 from "../assets/Images/Step4.png";
import Img5 from "../assets/Images/Step5.png";

const Carousel = () => {
  const slides = [
    {
      heading: "Step 1: Start a New Interview",
      text: "Click on the *New Interview* button in the *Start a New Interview* section at the top of the page.",
      image: Img1,
    },
    {
      heading: "Step 2: Configure Your Interview",
      text: "A popup will appear. Enter details like *Job Role*, *Skills*, and *Experience Level*, then click 'Start Interview'.",
      image: Img2,
    },
    {
      heading: "Step 3: Enable Webcam & Microphone",
      text: "Grant permissions to enable your *webcam and microphone* before proceeding with the AI mock interview.",
      image: Img3,
    },
    {
      heading: "Step 4: Answer AI-Generated Questions",
      text: "The AI will present *5 questions*. Answer them via *video recording* or *typed responses*. Once you've answered all questions, click on *'Finish'* to submit your responses.",
      image: Img4,
    },
    {
      heading: "Step 6: Receive Feedback",
      text: "After submission, you’ll get an *interview report* with a rating, correct answers, and detailed feedback.",
      image: Img5,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const formatText = (text) => {
    return text.split(/(\*.*?\*)/g).map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <span 
            key={index} 
            className="bg-yellow-200 px-1 rounded-md text-gray-800 font-medium"
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full mx-auto p-5 relative max-w-6xl">
      <div className="flex h-[500px] relative gap-4">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute -left-14 top-1/2 transform -translate-y-1/2 
                     bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition
                     border border-gray-200 hover:shadow-md"
        >
          <ChevronLeft className="w-8 h-8 text-gray-600" />
        </button>

        {/* Text Panel */}
        <div className="w-1/2 relative overflow-hidden p-8 flex flex-col justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-xl border border-white/20">
  {/* Floating elements background */}
  <div className="absolute inset-0">
    <div className="absolute w-32 h-32 bg-white/10 rounded-full -top-8 -left-8"></div>
    <div className="absolute w-48 h-48 bg-white/5 rounded-full -bottom-20 -right-20"></div>
  </div>

  <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                {slides[currentSlide].heading.split(':')[0]}
              </span>
              <br />
              {slides[currentSlide].heading.split(':')[1]}
            </h2>
            
            <p className="text-lg text-white/90 leading-relaxed mb-8">
              {formatText(slides[currentSlide].text)}
            </p>
          </div>

  {/* Decorative elements */}
  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/20 rounded-bl-2xl" />
  <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-400/20 rounded-tr-2xl" />
</div>

         {/* Image Panel */}
         <div className="w-1/2 relative overflow-hidden rounded-2xl shadow-lg
                        border border-gray-100 bg-blue-50">  {/* Changed background */}
          <img
            src={slides[currentSlide].image}
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-full object-contain p-6 transform hover:scale-105
                       transition-transform duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t
                         from-blue-50/50 to-transparent" />
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute -right-14 top-1/2 transform -translate-y-1/2 
                     bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition
                     border border-gray-200 hover:shadow-md"
        >
          <ChevronRight className="w-8 h-8 text-gray-600" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="mt-8 flex justify-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-blue-600 scale-125 shadow-sm" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;