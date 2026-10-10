"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MdMenu } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import navlogo from "../../assets/navlogo.svg";
import profilePic from "../../assets/profile.jpg";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = ({ onMenuClick, isMobile }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case "administrator":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      case "accountant":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full h-[62px] bg-tertiary border-b border-gray-600 px-4 sm:px-6 flex items-center justify-between z-50">
      {/* Left side - Mobile Menu + Logo */}
      <div className="flex items-center space-x-3">
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-hover transition-colors text-text-primary md:hidden"
            aria-label="Toggle navigation menu"
          >
            <MdMenu size={24} />
          </button>
        )}
        <Image src={navlogo} alt="DailyDocket Logo" width={155} priority />
      </div>

      {/* Right side - User details & Profile */}
      <div className="flex items-center space-x-3" ref={dropdownRef}>
        {user && (
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-sm font-semibold text-text-primary leading-tight">
              {user.fullName || "User"}
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border mt-0.5 ${getRoleBadgeClass(
                user.role
              )}`}
            >
              {user.role || "Staff"}
            </span>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center focus:outline-none"
            aria-label="Open user profile menu"
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullName || "User"}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-600 hover:ring-2 hover:ring-accent transition-all cursor-pointer"
              />
            ) : (
              <Image
                src={profilePic}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover cursor-pointer ring-1 ring-gray-600 hover:ring-2 hover:ring-accent transition-all"
              />
            )}
          </button>

          {/* User profile dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-secondary border border-gray-600 rounded-xl shadow-xl py-2 z-50 transition-all">
              <div className="px-4 py-2 border-b border-gray-600/70">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {user?.emailAddress || ""}
                </p>
                <div className="mt-1.5">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getRoleBadgeClass(
                      user?.role
                    )}`}
                  >
                    {user?.role || "Staff"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-hover flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <BiLogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
