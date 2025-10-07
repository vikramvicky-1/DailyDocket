"use client";

import { useState, useRef, useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";

const StatusFilter = ({ selectedStatus, onStatusChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statusOptions = [
    "All",
    "Order Received",
    "Out for Delivery",
    "Cancelled",
    "Completed",
  ];

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

  const handleStatusSelect = (status) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2.5 bg-form-bg text-text-primary rounded-lg border border-gray-600 hover:border-accent transition-colors min-w-[120px] text-sm"
      >
        <span>{selectedStatus}</span>
        <LuChevronDown
          size={16}
          className={`ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-primary border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar">
          {statusOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleStatusSelect(option)}
              className={`w-full px-4 py-3 text-left text-sm text-text-primary hover:bg-tertiary transition-colors ${
                selectedStatus === option ? "bg-tertiary" : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusFilter;
