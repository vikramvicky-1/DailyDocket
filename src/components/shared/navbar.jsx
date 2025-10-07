import React from "react";
import Image from "next/image";
import { MdMenu, MdClose } from "react-icons/md";
import navlogo from "../../assets/navlogo.svg";
import profilePic from "../../assets/profile.jpg";

const Navbar = ({ onMenuClick, isMobile, isMenuOpen }) => {
  return (
    <nav className="w-full h-[62px] bg-tertiary border-b border-gray-600 px-5 flex items-center justify-between relative z-50">
      {/* Left side - Mobile Menu + Logo */}
      <div className="flex items-center space-x-3">
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-hover transition-colors text-text-primary md:hidden"
          >
            <MdMenu size={24} />
          </button>
        )}
        <Image src={navlogo} alt="DailyDocket Logo" width={155} />
      </div>

      {/* Right side - Profile */}
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
    </nav>
  );
};

export default Navbar;
