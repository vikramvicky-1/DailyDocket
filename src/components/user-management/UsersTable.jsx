"use client";

import React from "react";
import { LuTrash2 } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";

const UsersTable = ({ usersData }) => {
  const handleEdit = (user) => {
    console.log("Edit user:", user);
    // Edit functionality will be implemented later
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
    <div className="space-y-4 sm:space-y-6">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
          Users Data
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
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

      {/* Single Responsive Table Container for All Screens */}
      <div className="overflow-x-auto">
        <div className="min-w-auto">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-600 bg-form-bg rounded-tl-xl rounded-tr-xl">
            {columns.map((column) => (
              <div
                key={column.key}
                className={`text-left text-text-primary text-[11px] font-medium sm:text-[13px] ${
                  column.key === "actions" ? "text-center" : ""
                }`}
              >
                <div className="flex items-center justify-between whitespace-nowrap">
                  <span className="min-w-0">{column.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {usersData.length > 0 ? (
              usersData.map((user, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 hover:bg-secondary/50 transition-colors"
                >
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {user.name}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {user.email}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 hover:bg-hover rounded transition-colors text-text-primary hover:text-white"
                        title="Edit User"
                      >
                        <TbEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1.5 hover:bg-red/20 rounded transition-colors text-text-primary hover:text-red"
                        title="Delete User"
                      >
                        <LuTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 sm:p-8 text-center text-text-primary">
                No users data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
