"use client";
import React from "react";
import Navbar from "../shared/navbar";
import Sidebar from "../shared/sidebar";
import { useSidebar } from "../../contexts/SidebarContext";
import "../../styles/layout.css";

const MainLayout = ({ children }) => {
  const { sidebarExpanded, isMobile, isClient, toggleSidebar } = useSidebar();

  return (
    <div className={`min-h-screen bg-primary ${isClient ? 'hydration-safe' : 'hydration-loading'}`}>
      <Navbar 
        onMenuClick={toggleSidebar}
        isMobile={isMobile}
      />
      <div className="flex">
        <Sidebar 
          isExpanded={sidebarExpanded} 
          setIsExpanded={toggleSidebar}
          isMobile={isMobile}
        />
        <main 
          className={`flex-1 layout-transition main-content ${
            isMobile 
              ? "ml-0" 
              : sidebarExpanded 
                ? "ml-[280px]" 
                : "ml-16"
          }`}
          style={{
            // Prevent layout shift during hydration
            minHeight: 'calc(100vh - 62px)'
          }}
        >
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile overlay */}
      {isMobile && sidebarExpanded && (
        <div 
          className="fixed inset-0 mobile-overlay z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default MainLayout;
