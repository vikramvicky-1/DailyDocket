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
    <div className="w-full max-w-full">
      {/* Page Header */}
      <div className="flex mb-6 flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold mb-6 text-white">User Management</h1>
        <div className="flex items-center space-x-4">
          <RoleFilter
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
          />
          <button
            onClick={handleAddUser}
            className="flex items-center space-x-2 px-2 md:px-6 py-2.5 md:py-3 bg-accent hover:bg-hover-700 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
          >
            <LuPlus size={18} />
            <span>Add New User</span>
          </button>
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
