"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LuTrash2 } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";

const UsersTable = ({ usersData }) => {
  const router = useRouter();

  const handleEdit = (user, index) => {
    // In real app, you would use the actual user ID
    const userId = user.id || index + 1; // Using user ID or index+1 as mock ID
    router.push(`/user-management/edit/${userId}`);
  };

  const handleDelete = (user) => {
    console.log("Delete user:", user);
    // Delete functionality will be implemented later
  };

  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case "administrator":
        return "bg-red-600 text-white";
      case "staff":
        return "bg-blue-600 text-white";
      case "accountant":
        return "bg-yellow-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="bg-secondary max-sm:p-2 rounded-xl flex flex-col h-full">
      {/* 1. STATIC HEADER SECTION: This part will NOT scroll. */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
          Users Data
        </h2>
        <div className="flex flex-col max-sm:flex-row justify-between sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="text-text-primary">
            <span className="text-sm sm:text-lg font-medium">
              Total Users:{" "}
            </span>
            <span className="text-lg sm:text-xl font-bold text-accent">
              {usersData.length}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT AREA: This container will scroll. */}
      <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[500px] md:max-h-[500px] lg:max-h-[450px]">
        {/* Table Header (Visible on large screens only, STICKY) */}
        <div className="hidden lg:grid grid-cols-4 gap-4 p-4 border-b border-secondary bg-form-bg rounded-t-lg sticky top-0 z-10">
          {columns.map((column) => (
            <div
              key={column.key}
              className={`text-left text-text-primary/70 text-[14px] font-[400] ${
                column.key === "actions"
                  ? "text-center flex justify-center"
                  : ""
              }`}
            >
              <span>{column.label}</span>
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="space-y-4 lg:space-y-0">
          {usersData.length > 0 ? (
            usersData.map((user, index) => (
              <div
                key={index}
                className="block p-4 rounded-lg bg-secondary border-b border-gray-600/60 lg:grid lg:grid-cols-4 lg:gap-4 lg:p-4 lg:border-b lg:border-gray-600/60 lg:rounded-none lg:bg-transparent text-sm text-text-primary"
              >
                <div className="flex justify-between lg:block">
                  <span className="font-bold text-text-primary/60 lg:hidden">
                    Name:
                  </span>{" "}
                  {user.name}
                </div>
                <div className="flex justify-between lg:block">
                  <span className="font-bold text-text-primary/60 lg:hidden">
                    Email:
                  </span>{" "}
                  {user.email}
                </div>
                <div className="flex justify-between lg:block">
                  <span className="font-bold text-text-primary/60 lg:hidden">
                    Role:
                  </span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="flex justify-end items-center mt-4 pt-4 border-t border-secondary/50 lg:mt-0 lg:pt-0 lg:border-none lg:justify-center">
                  <button
                    onClick={() => handleEdit(user, index)}
                    className="p-1.5 cursor-pointer  hover:text-blue-700 hover:bg-hover rounded transition-colors"
                    title="Edit"
                  >
                    <TbEdit size={17} />
                  </button>
                  <button
                    className="p-1.5 hover:text-red cursor-pointer hover:bg-hover rounded transition-colors"
                    title="Delete"
                  >
                    <LuTrash2 size={17} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-text-primary/60 bg-secondary rounded-b-lg">
              No users data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
