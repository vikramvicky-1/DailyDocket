"use client";

import { useState, useEffect, useRef } from "react";
import { LuChevronDown } from "react-icons/lu";

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categoryOptions = [
    "All",
    "Masala Materials",
    "Powder",
    "Snacks",
    "Vegetables",
    "Dairy Products",
    "Packaging",
    "Transportation",
    "Utilities",
    "Equipment",
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

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[140px] px-3 py-2 bg-tertiary text-white text-sm rounded-lg border border-gray-600 hover:border-accent transition-colors"
      >
        <span className="truncate">
          {selectedCategory === "All" ? "Select Category" : selectedCategory}
        </span>
        <LuChevronDown
          size={16}
          className={`ml-2 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-tertiary border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {categoryOptions.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors ${
                selectedCategory === category
                  ? "bg-accent/20 text-accent"
                  : "text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
