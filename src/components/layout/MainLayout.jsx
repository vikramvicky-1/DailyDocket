"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "../shared/navbar";
import Sidebar from "../shared/sidebar";
import ChatWidget from "../chatbot/ChatWidget";
import { useSidebar } from "../../contexts/SidebarContext";
import "../../styles/layout.css";

const MainLayout = ({ children }) => {
  const pathname = usePathname();
  const { sidebarExpanded, isMobile, isClient, toggleSidebar } = useSidebar();

  if (pathname === "/login") {
    return <div className="min-h-screen bg-[#0B0814]">{children}</div>;
  }

  return (
    <div
      className={`min-h-screen bg-primary ${isClient ? "hydration-safe" : "hydration-loading"
        }`}
    >
      <Navbar onMenuClick={toggleSidebar} isMobile={isMobile} />
      <div className="flex pt-[62px]">
        <Sidebar
          isExpanded={sidebarExpanded}
          setIsExpanded={toggleSidebar}
          isMobile={isMobile}
        />
        <main
          className={`flex-1 layout-transition main-content ${isMobile ? "ml-0" : sidebarExpanded ? "ml-[280px]" : "ml-16"
            }`}
          style={{
            // Prevent layout shift during hydration
            minHeight: "calc(100vh - 62px)",
          }}
        >
          <div
            className={`
            p-4 
            ${isMobile
                ? "md:p-6"
                : sidebarExpanded
                  ? "md:p-6 lg:p-8"
                  : "md:p-6 lg:p-8 xl:p-10"
              } 
            transition-all duration-300 ease-in-out
          `}
          >
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

      {/* AI Chatbot Widget */}
      <ChatWidget />
    </div>
  );
};

export default MainLayout;
