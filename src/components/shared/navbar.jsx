import React from "react";
import Image from "next/image";
import { MdMenu, MdClose } from "react-icons/md";
import navlogo from "../../assets/navlogo.svg";
import profilePic from "../../assets/profile.jpg";

const Navbar = ({ onMenuClick, isMobile, isMenuOpen }) => {
  return (
    <nav className="w-full h-[62px] bg-tertiary border-b border-gray-600 px-5 flex items-center relative z-50">
      {isMobile ? (
        <>
          {/* Mobile Layout: Left Menu | Center Logo | Right Profile */}
          {/* Left side - Mobile Menu */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-hover transition-colors text-text-primary"
            >
              {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Image src={navlogo} alt="DailyDocket Logo" width={155} />
          </div>

          {/* Right side - Profile */}
          <div className="flex items-center ml-auto">
            <div className="relative">
              <Image
                src={profilePic}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-accent transition-all"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Desktop Layout: Logo left, Profile right */}
          <div className="flex items-center">
            <Image src={navlogo} alt="DailyDocket Logo" width={155} />
          </div>

          <div className="flex items-center">
            <div className="relative">
              <Image
                src={profilePic}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-accent transition-all"
              />
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
