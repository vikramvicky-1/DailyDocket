"use client";

import React from "react";

const Skeleton = ({ 
  className = "", 
  width = "100%", 
  height = "20px",
  rounded = "rounded",
  animate = true 
}) => {
  return (
    <div
      className={`
        bg-gray-700/50 
        ${rounded} 
        ${animate ? "animate-pulse" : ""} 
        ${className}
      `}
      style={{ width, height }}
    />
  );
};

// Skeleton variants for common use cases
export const SkeletonText = ({ lines = 1, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height="16px"
          width={index === lines - 1 ? "75%" : "100%"}
          className="bg-gray-700/30"
        />
      ))}
    </div>
  );
};

export const SkeletonCircle = ({ size = "40px", className = "" }) => {
  return (
    <Skeleton
      width={size}
      height={size}
      rounded="rounded-full"
      className={`bg-gray-700/40 ${className}`}
    />
  );
};

export const SkeletonButton = ({ width = "120px", height = "40px", className = "" }) => {
  return (
    <Skeleton
      width={width}
      height={height}
      rounded="rounded-lg"
      className={`bg-gray-700/40 ${className}`}
    />
  );
};

export const SkeletonCard = ({ className = "" }) => {
  return (
    <div className={`bg-secondary rounded-lg p-4 space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <SkeletonCircle size="48px" />
        <div className="flex-1">
          <SkeletonText lines={2} />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
};

export default Skeleton;
