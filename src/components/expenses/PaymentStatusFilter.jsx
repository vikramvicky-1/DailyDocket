"use client";

import { useState, useEffect, useRef } from "react";
import { LuChevronDown } from "react-icons/lu";

const PaymentStatusFilter = ({ selectedStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statusOptions = ["All", "Paid", "Pending"];

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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[120px] px-3 py-2 bg-tertiary text-white text-sm rounded-lg border border-gray-600 hover:border-accent transition-colors"
      >
        <span className="truncate">
          {selectedStatus === "All" ? "Select Status" : selectedStatus}
        </span>
        <LuChevronDown
          size={16}
          className={`ml-2 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-primary border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusSelect(status)}
              className={`w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-tertiary transition-colors ${
                selectedStatus === status ? "bg-tertiary" : ""
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentStatusFilter;
