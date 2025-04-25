import { SignIn } from "@clerk/clerk-react";
import React from "react";
import Img1 from "../../assets/Images/PrepPath.png";

function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden relative">
        {/* Left Section: Image */}
        <div className="lg:w-6.5/12 w-full flex items-center justify-center p-1 relative">
          <img
            src={Img1}
            alt="Login Illustration"
            className="w-100 h-100 object-cover"
          />
          {/* Top Gradient */}
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-200 to-transparent"></div>
          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-blue-200 to-transparent"></div>
        </div>

        {/* Right Section: Login Form */}
        <div className="lg:w-7/12 w-full flex items-center justify-center p-8 relative">
          <div className="w-full max-w-md relative z-10">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
              Sign In to Your Account
            </h2>
            <SignIn afterSignInUrl="/dashboard" />
          </div>
          {/* Top Gradient */}
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-200 to-transparent"></div>
          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-blue-200 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
