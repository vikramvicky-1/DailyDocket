"use client";

import React, { useState, useRef, useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";

const RoleFilter = ({ selectedRole, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roleOptions = ["All", "Administrator", "Staff", "Accountant"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRoleSelect = (role) => {
    onRoleChange(role);
    setIsOpen(false);
  };

  const displayText = selectedRole === "All" ? "Select Role" : selectedRole;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2.5 bg-form-bg text-text-primary rounded-lg border border-gray-600 hover:border-accent transition-colors min-w-[140px] text-sm"
      >
        <span className="truncate">{displayText}</span>
        <LuChevronDown
          size={16}
          className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-form-bg border border-gray-600 rounded-lg shadow-lg z-50 overflow-hidden">
          {roleOptions.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              className={`w-full px-4 py-3 text-left text-sm text-text-primary hover:bg-secondary transition-colors ${
                selectedRole === role ? "bg-secondary" : ""
              }`}
            >
              {role === "All" ? "Select Role" : role}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleFilter;
