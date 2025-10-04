"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../../contexts/SidebarContext";
import { PiChartBarBold, PiSuitcaseSimpleBold } from "react-icons/pi";
import { LuWallet, LuUser } from "react-icons/lu";
import { BsBoxSeam } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { RiMenuUnfold2Line, RiMenuFold2Line } from "react-icons/ri";

const Sidebar = ({ isExpanded, setIsExpanded, isMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { closeSidebar, isClient } = useSidebar();

  const menuItems = [
    {
      name: "Dashboard",
      icon: PiChartBarBold,
      path: "/",
      url: "/",
    },
    {
      name: "Sales",
      icon: LuWallet,
      path: "/(main)/sales",
      url: "/sales",
    },
    {
      name: "Orders",
      icon: BsBoxSeam,
      path: "/(main)/orders",
      url: "/orders",
    },
    {
      name: "Expenses",
      icon: PiSuitcaseSimpleBold,
      path: "/(main)/expenses",
      url: "/expenses",
    },
    {
      name: "User Management",
      icon: LuUser,
      path: "/(main)/user-management",
      url: "/user-management",
    },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Prevent hydration mismatch by not rendering interactive elements until client-side
  if (!isClient) {
    return (
      <div
        className={`fixed left-0 top-[62px] h-[calc(100vh-62px)] bg-tertiary sidebar-transition z-40 flex flex-col ${
          isMobile
            ? `w-[280px] sidebar-mobile-collapsed overflow-hidden`
            : `w-16 overflow-visible`
        }`}
      >
        {/* Static placeholder during SSR */}
        <nav className={`flex-1 px-2 space-y-2 ${isMobile ? "pt-4" : ""}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.path} className="relative group">
                <div className="nav-link flex items-center h-11 px-2 py-1 rounded-lg text-text-primary">
                  <Icon size={20} className="flex-shrink-0" />
                  {isExpanded && (
                    <span className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden">
                      {item.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-2 border-t border-gray-600">
          <div className="relative group">
            <div className="nav-link flex items-center w-full h-11 px-2 py-1 rounded-lg text-text-primary">
              <BiLogOut size={20} className="flex-shrink-0" />
              {isExpanded && (
                <span className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden">
                  Logout
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed left-0 top-[62px] h-[calc(100vh-62px)] bg-tertiary sidebar-transition z-40 flex flex-col ${
        isMobile
          ? `w-[280px] ${
              isExpanded
                ? "sidebar-mobile-expanded"
                : "sidebar-mobile-collapsed"
            } overflow-hidden`
          : `${
              isExpanded ? "w-[280px]" : "w-16 sidebar-collapsed"
            } overflow-visible`
      }`}
    >
      {/* Toggle Button - Only show on desktop */}
      {!isMobile && (
        <div
          className={`flex p-2 ${
            isExpanded ? "justify-end" : "justify-center"
          }`}
        >
          <div className="relative group">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-hover transition-colors text-text-primary"
            >
              {isExpanded ? (
                <RiMenuUnfold2Line size={20} />
              ) : (
                <RiMenuFold2Line size={20} />
              )}
            </button>

            {/* Tooltip for collapsed sidebar toggle */}
            {!isExpanded && (
              <div className="sidebar-tooltip">
                Expand Menu
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className={`flex-1 px-2 space-y-2 ${isMobile ? "pt-4" : ""}`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname === item.url;

          // Handle click for navigation
          const handleClick = (e) => {
            if (isClient && isMobile) {
              e.preventDefault();
              if (isActive) {
                // If clicking on current page, just close sidebar
                closeSidebar();
              } else {
                // If clicking on different page, close sidebar and navigate
                closeSidebar();
                setTimeout(() => {
                  router.push(item.url);
                }, 100);
              }
            }
            // For desktop, let the link navigate normally
          };

          return (
            <div key={item.path} className="relative">
              <div className="relative group tooltip-container">
                <Link
                  href={item.url}
                  onClick={handleClick}
                  className={`nav-link flex items-center h-11 px-2 py-1 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-hover text-white focus:bg-hover focus:text-white active"
                      : "text-text-primary hover:bg-hover hover:text-white focus:bg-hover focus:text-white"
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {isExpanded && (
                    <span className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden flex-1">
                      {item.name}
                    </span>
                  )}
                </Link>

                {/* Tooltip for collapsed sidebar - for all items */}
                {!isExpanded && !isMobile && (
                  <div className="sidebar-tooltip">
                    {item.name}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-2 border-t border-gray-600">
        <div className="relative group">
          <button
            className={`nav-link flex items-center w-full h-11 px-2 py-1 rounded-lg text-text-primary hover:bg-hover hover:text-white focus:bg-hover focus:text-white`}
          >
            <BiLogOut size={20} className="flex-shrink-0" />
            {isExpanded && (
              <span className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden">
                Logout
              </span>
            )}
          </button>

          {/* Tooltip for collapsed sidebar */}
          {!isExpanded && !isMobile && (
            <div className="sidebar-tooltip">
              Logout
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
