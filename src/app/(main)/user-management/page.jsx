"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuPlus } from "react-icons/lu";
import UsersTable from "../../../components/user-management/UsersTable";
import UsersTableSkeleton from "../../../components/user-management/UsersTableSkeleton";
import RoleFilter from "../../../components/user-management/RoleFilter";
import { useData } from "../../../contexts/DataContext";

const UserManagementPage = () => {
  const router = useRouter();
  const { users } = useData();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedRole === "All") {
      setFilteredData(users);
    } else {
      setFilteredData(users.filter((user) => user.role === selectedRole));
    }
  }, [users, selectedRole]);

  const handleAddUser = () => {
    router.push("/user-management/add-new-user");
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  return (
    <div className="w-full max-w-full ">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Users</h1>
          <div className="hidden md:flex items-center space-x-4">
            <RoleFilter
              selectedRole={selectedRole}
              onRoleChange={handleRoleChange}
            />
            <button
              onClick={handleAddUser}
              className="flex cursor-pointer items-center space-x-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium"
            >
              <LuPlus size={18} />
              <span>Add New User</span>
            </button>
          </div>
          <button
            onClick={handleAddUser}
            className="md:hidden flex items-center space-x-2 px-2 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <LuPlus size={18} />
            <span>Add New User</span>
          </button>
        </div>
        <div className="md:hidden flex items-center justify-start">
          <RoleFilter
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
          />
        </div>
      </div>
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
