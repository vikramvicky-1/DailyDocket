"use client";

import React, { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import UsersTable from "../../../components/user-management/UsersTable";
import UsersTableSkeleton from "../../../components/user-management/UsersTableSkeleton";
import RoleFilter from "../../../components/user-management/RoleFilter";

// Mock data for demonstration
const mockUsersData = [
  {
    name: "Aarav Mehta",
    email: "Aarav@gmail.com",
    role: "Administrator",
  },
  {
    name: "Riya Kapoor",
    email: "Riya@gmail.com",
    role: "Staff",
  },
  {
    name: "Kabir Sharma",
    email: "Kabir@gmail.com",
    role: "Staff",
  },
  {
    name: "Sneha Iyer",
    email: "Sneha@gmail.com",
    role: "Accountant",
  },
  {
    name: "Aditya Nair",
    email: "Aditya@gmail.com",
    role: "Accountant",
  },
  {
    name: "Aarv Mehta",
    email: "Aarav@gmail.com",
    role: "Administrator",
  },
  {
    name: "Riya Kapoor",
    email: "Riya@gmail.com",
    role: "Staff",
  },
  {
    name: "Kabir Sharma",
    email: "Kabir@gmail.com",
    role: "Staff",
  },
  {
    name: "Sneha Iyer",
    email: "Sneha@gmail.com",
    role: "Accountant",
  },
  {
    name: "Aditya Nair",
    email: "Aditya@gmail.com",
    role: "Accountant",
  },
  {
    name: "Aarav Mehta",
    email: "Aarav@gmail.com",
    role: "Administrator",
  },
  {
    name: "Riya Kapoor",
    email: "Riya@gmail.com",
    role: "Staff",
  },
  {
    name: "Kabir Sharma",
    email: "Kabir@gmail.com",
    role: "Staff",
  },
  {
    name: "Sneha Iyer",
    email: "Sneha@gmail.com",
    role: "Accountant",
  },
  {
    name: "Aditya Nair",
    email: "Aditya@gmail.com",
    role: "Accountant",
  },
];

const UserManagementPage = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("All");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUsersData(mockUsersData);
      setFilteredData(mockUsersData);
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter data based on selected role
  useEffect(() => {
    let filtered = usersData;

    if (selectedRole !== "All") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    setFilteredData(filtered);
  }, [usersData, selectedRole]);

  const handleAddUser = () => {
    console.log("Add user clicked");
    // Add user functionality will be implemented later
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  return (
    <div className="w-full max-w-full h-[calc(100vh-95px)]">
      {/* Page Header */}
      <div className="mb-6 space-y-4">
        {/* Title and Add Button Row - Always together */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">
            User Management
          </h1>

          {/* Controls Row for Medium+ screens - Filter + Add Button */}
          <div className="hidden md:flex items-center space-x-4">
            <RoleFilter
              selectedRole={selectedRole}
              onRoleChange={handleRoleChange}
            />
            <button
              onClick={handleAddUser}
              className="flex items-center space-x-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium"
            >
              <LuPlus size={18} />
              <span>Add New User</span>
            </button>
          </div>

          {/* Add Button for Small screens - Always at top right */}
          <button
            onClick={handleAddUser}
            className="md:hidden flex items-center space-x-2 px-2 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <LuPlus size={18} />
            <span>Add New User</span>
          </button>
        </div>

        {/* Filters Row for Small screens - Below title */}
        <div className="md:hidden flex items-center justify-start">
          <RoleFilter
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-secondary shadow-md rounded-xl p-2 sm:p-4 md:p-5 lg:p-6 space-y-2 overflow-hidden w-full">
        {loading ? (
          <UsersTableSkeleton />
        ) : (
          <UsersTable usersData={filteredData} />
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
