"use client";

import React, { useState, useRef, useEffect } from "react";
import { LuChevronDown, LuCheck } from "react-icons/lu";

const CustomDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = "Select Option",
  required = false,
  name = "",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  // Find selected option based on value
  useEffect(() => {
    const option = options.find((opt) => opt.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);

    // Create synthetic event for onChange
    const syntheticEvent = {
      target: {
        name: name,
        value: option.value,
      },
    };
    onChange(syntheticEvent);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative w-full min-w-0 ${className}`} ref={dropdownRef}>
      {/* Hidden input for form validation */}
      <input type="hidden" name={name} value={value} required={required} />

      {/* Dropdown Trigger */}
      <div
        className="w-full h-11 px-5 py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors cursor-pointer flex items-center justify-between min-w-0"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={`truncate flex-1 ${
            selectedOption ? "text-text-primary" : "text-gray-400"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <LuChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-secondary border border-[#545454] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-gray-400 text-sm">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className="px-4 py-3 hover:bg-accent/10 cursor-pointer transition-colors flex items-center justify-between"
                onClick={() => handleOptionSelect(option)}
                role="option"
                aria-selected={selectedOption?.value === option.value}
              >
                <span className="text-text-primary text-sm truncate flex-1">
                  {option.label}
                </span>
                {selectedOption?.value === option.value && (
                  <LuCheck className="w-4 h-4 text-accent flex-shrink-0 ml-2" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
