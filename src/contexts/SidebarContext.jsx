"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Initialize only once when the provider mounts
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    
    // Initialize sidebar state from localStorage or default
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null && !mobile) {
      setSidebarExpanded(JSON.parse(savedState));
    } else {
      setSidebarExpanded(!mobile);
    }
    
    setIsClient(true);
  }, []);

  // Handle window resize
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      const wasMobile = isMobile;
      setIsMobile(mobile);
      
      // Auto-collapse sidebar when switching to mobile
      if (mobile && !wasMobile) {
        setSidebarExpanded(false);
      }
    };

    if (isClient) {
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }
  }, [isMobile, isClient]);

  // Save sidebar state to localStorage
  useEffect(() => {
    if (isClient && !isMobile) {
      localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
    }
  }, [sidebarExpanded, isClient, isMobile]);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const closeSidebar = () => {
    setSidebarExpanded(false);
  };

  const value = {
    sidebarExpanded,
    setSidebarExpanded,
    isMobile,
    isClient,
    toggleSidebar,
    closeSidebar
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
