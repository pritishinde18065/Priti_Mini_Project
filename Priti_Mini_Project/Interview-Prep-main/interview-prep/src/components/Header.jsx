import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./../assets/Images/PathLogo.png";
import { FaTimes, FaBars, FaBirthdayCake } from "react-icons/fa";
import { useUser, UserButton } from "@clerk/clerk-react";

const Header = () => {
  const { isSignedIn } = useUser();
  const [navbar, setNavbar] = useState(false);
  const location = useLocation();

  const Navbar = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Resume", link: "/resume" },
    { name: "Services", link: "/services" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <nav className="w-full h-auto bg-gray-200 lg:px-24 md:px-16 sm:px-14 px-12 py-2 shadow-md">
      <div className="justify-between mx-auto lg:w-full md:items-center md:flex">
        {/* Navbar logo & toggle button section */}
        <div>
          <div className="flex items-center justify-between py-2 md:py-5 md:block">
            {/* Logo section */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">PrepPath</span>
              <img
                src={Logo}
                alt="Logo"
                className="h-14 w-14 md:h-14 md:w-14 sm:h-10 sm:w-10 ml-2"
              />
            </Link>
            {/* Toggle button section */}
            <div className="md:hidden">
              <button
                className="p-2 text-gray-700 rounded-md outline-none border border-transparent focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <FaTimes className="text-gray-400 cursor-pointer" size={24} />
                ) : (
                  <FaBars className="text-gray-400 cursor-pointer" size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navbar menu items section */}
        <div
          className={`flex justify-between items-center md:block ${
            navbar ? "block" : "hidden"
          }`}
        >
          <ul className="list-none lg:flex md:flex sm:block block gap-x-5 gap-y-16">
            {isSignedIn &&
              Navbar.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className={`text-[1.15rem] font-medium tracking-wider ease-out duration-700 ${
                      location.pathname === item.link
                        ? "text-blue-500 border-b-2 border-blue-500"
                        : "text-gray-700 hover:text-blue-500"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            {isSignedIn ? (
              <UserButton />
            ) : (
              <>
                <Link to="/auth/sign-in">
                  <button className="bg-white text-[1.1rem] font-normal text-blue-500 hover:text-white hover:bg-blue-500 px-5 py-1.5 rounded lg:ml-10 md:ml-6 sm:ml-0 ml-0">
                    Login
                  </button>
                </Link>
                <Link to="/auth/sign-up">
                  <button className="bg-blue-500 text-[1.1rem] font-normal text-white hover:bg-white hover:text-blue-500 px-5 py-1.5 rounded lg:ml-2 md:ml-2 sm:ml-2 ml-2">
                    Register
                  </button>
                </Link>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;



