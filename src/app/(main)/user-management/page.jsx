import React from "react";

const UserManagementPage = () => {
  return (
    <div className="text-text-primary">
      <h1 className="text-3xl font-bold text-accent mb-4">User Management</h1>
      <p className="text-lg">Welcome to the User Management system!</p>
      <div className="mt-6 bg-secondary p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          User Management Overview
        </h2>
        <p>
          This is where you can manage user accounts, permissions, roles, and
          access controls.
        </p>
      </div>
    </div>
  );
};

export default UserManagementPage;
