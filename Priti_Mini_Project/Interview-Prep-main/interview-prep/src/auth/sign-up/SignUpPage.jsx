import { SignUp } from "@clerk/clerk-react";
import React from "react";
import Img2 from "../../assets/Images/create.jpg";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden relative">
        {/* Left Section: Image */}
        <div className="lg:w-6.5/12 w-full flex items-center justify-center p-1 relative">
          <img
            src={Img2}
            alt="Signup Illustration"
            className="w-full h-3/4 object-cover"
          />
          {/* Top Gradient */}
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-200 to-transparent"></div>
          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-blue-200 to-transparent"></div>
        </div>

        {/* Right Section: Signup Form */}
        <div className="lg:w-7/12 w-full flex items-center justify-center p-8 relative">
          <div className="w-full max-w-md relative z-10">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
              Create Your Account
            </h2>
            <SignUp afterSignUpUrl="/dashboard" />
          </div>
          {/* Top Gradient */}
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-200 to-transparent"></div>
          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-blue-200 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
