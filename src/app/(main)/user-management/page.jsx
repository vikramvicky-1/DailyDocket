"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuPlus } from "react-icons/lu";
import UsersTable from "../../../components/user-management/UsersTable";
import UsersTableSkeleton from "../../../components/user-management/UsersTableSkeleton";
import RoleFilter from "../../../components/user-management/RoleFilter";
import { useData } from "../../../contexts/DataContext";
import { useAuth } from "../../../contexts/AuthContext";
import PermissionGuard from "../../../components/shared/PermissionGuard";

const UserManagementPage = () => {
  const router = useRouter();
  const { users, loading } = useData();
  const { canManage } = useAuth();
  const canManageUsers = canManage("userManagement");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRole, setSelectedRole] = useState("All");

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
    <PermissionGuard moduleKey="userManagement" requiredAction="view">
      <div className="w-full max-w-full ">
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text-primary">Users</h1>
            <div className="hidden md:flex items-center space-x-4">
              <RoleFilter
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
              />
              {canManageUsers && (
                <button
                  onClick={handleAddUser}
                  className="flex cursor-pointer items-center space-x-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium"
                >
                  <LuPlus size={18} />
                  <span>Add New User</span>
                </button>
              )}
            </div>
            {canManageUsers && (
              <button
                onClick={handleAddUser}
                className="md:hidden flex items-center space-x-2 px-2 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <LuPlus size={18} />
                <span>Add New User</span>
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center justify-start">
            <RoleFilter
              selectedRole={selectedRole}
              onRoleChange={handleRoleChange}
            />
          </div>
        </div>
        <div className="flex-1 min-h-0">
          {loading ? (
            <UsersTableSkeleton />
          ) : (
            <UsersTable usersData={filteredData} canManage={canManageUsers} />
          )}
        </div>
      </div>
    </PermissionGuard>
  );
};

export default UserManagementPage;
