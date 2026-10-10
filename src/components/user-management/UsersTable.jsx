"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../../contexts/DataContext";
import { LuTrash2 } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";
import { CgExport } from "react-icons/cg";
import UserMobileCard from "./UserMobileCard";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import ExportModal from "../shared/ExportModal";
import {
  exportToExcel,
  exportToPdf,
  formatReportDate,
} from "../../lib/exportUtils";

const UsersTable = ({ usersData = [], canManage = true }) => {
  const router = useRouter();
  const { deleteUser } = useData();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleEdit = (user) => {
    const userId = user._id || user.id;
    router.push(`/user-management/edit/${userId}`);
  };

  const handleDelete = (user) => {
    const isDefaultAdmin = Boolean(
      user.isDefaultAdmin || user.email?.toLowerCase() === "admin@dailydocket.com"
    );
    if (isDefaultAdmin) {
      alert("The default system administrator account cannot be deleted.");
      return;
    }
    setDeleteTarget(user);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const userId = deleteTarget._id || deleteTarget.id;
      await deleteUser(userId);
      setDeleteTarget(null);
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Export Handlers ---
  const handleExportClick = () => {
    setShowExportDialog(true);
  };

  const handleExportExcel = async () => {
    if (usersData.length === 0) {
      alert("No user records available to export.");
      return;
    }
    await exportToExcel({
      filename: "DailyDocket_Users_Report",
      sheetName: "Users",
      columns: [
        { key: "name", header: "Name", format: (v, r) => r.fullName || r.name || "-" },
        { key: "email", header: "Email", format: (v) => v || "-" },
        { key: "role", header: "Role", format: (v) => v || "-" },
        { key: "createdAt", header: "Date Created", format: (v) => formatReportDate(v) },
      ],
      data: usersData,
    });
  };

  const handleExportPdf = async () => {
    if (usersData.length === 0) {
      alert("No user records available to export.");
      return;
    }

    await exportToPdf({
      filename: "DailyDocket_Users_Report",
      title: "User Accounts Directory",
      subtitle: `Total Registered Users: ${usersData.length}`,
      orientation: "portrait",
      columns: [
        { key: "name", header: "Name", format: (v, r) => r.fullName || r.name || "-" },
        { key: "email", header: "Email", format: (v) => v || "-" },
        { key: "role", header: "Role", format: (v) => v || "-" },
        { key: "createdAt", header: "Date Created", format: (v) => formatReportDate(v) },
      ],
      columnStyles: {
        0: { halign: "center", cellWidth: 26 },
        1: { cellWidth: 140, halign: "center" },
        2: { cellWidth: 170, halign: "center" },
        3: { cellWidth: 90, halign: "center" },
        4: { halign: "center" },
      },
      summaryRow: [
        "TOTAL",
        `${usersData.length} Users`,
        "",
        "",
      ],
      data: usersData,
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
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

  const allColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "actions", label: "Actions" },
  ];

  const columns = canManage
    ? allColumns
    : allColumns.filter((col) => col.key !== "actions");

  const gridColsClass = canManage ? "grid-cols-4" : "grid-cols-3";

  return (
    <div className="bg-secondary max-sm:p-2 rounded-xl flex flex-col h-full">
      {/* 1. STATIC HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
        {/* Small screens: heading and export on same line */}
        <div className="flex items-center justify-between sm:hidden">
          <h2 className="text-lg font-semibold text-text-primary">
            Users Data
          </h2>
          <button
            onClick={handleExportClick}
            className="flex items-center cursor-pointer space-x-2 px-3 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors text-sm"
          >
            <CgExport size={18} />
            <span>Export</span>
          </button>
        </div>

        {/* Large screens */}
        <h2 className="hidden sm:block text-lg sm:text-xl font-semibold text-text-primary">
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
          <button
            onClick={handleExportClick}
            className="hidden sm:flex items-center cursor-pointer space-x-2 px-3 sm:px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors text-sm"
          >
            <CgExport size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[500px] md:max-h-[500px] lg:max-h-[450px]">
        {/* Table Header (Visible on large screens only, STICKY) */}
        <div className={`hidden lg:grid ${gridColsClass} gap-4 p-4 border-b border-secondary bg-form-bg rounded-t-lg sticky top-0 z-10`}>
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

        {/* Mobile Card Layout for small screens */}
        <div className="lg:hidden space-y-4">
          {usersData.length > 0 ? (
            usersData.map((user, index) => (
              <UserMobileCard
                key={index}
                user={user}
                index={index}
                canManage={canManage}
                onEdit={canManage ? handleEdit : null}
                onDelete={canManage ? handleDelete : null}
              />
            ))
          ) : (
            <div className="p-8 text-center text-text-primary/60 bg-secondary rounded-b-lg">
              No users data available
            </div>
          )}
        </div>

        {/* Table Body for large screens */}
        <div className="hidden lg:block space-y-0">
          {usersData.length > 0 ? (
            usersData.map((user, index) => {
              const isDefaultAdmin = Boolean(
                user.isDefaultAdmin || user.email?.toLowerCase() === "admin@dailydocket.com"
              );

              return (
                <div
                  key={index}
                  className={`grid ${gridColsClass} gap-4 p-4 border-b border-gray-600/60 text-sm text-text-primary items-center`}
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate">{user.fullName || user.name}</span>
                    {isDefaultAdmin && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 whitespace-nowrap">
                        Primary Admin
                      </span>
                    )}
                  </div>
                  <div className="truncate">{user.email}</div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  {canManage && (
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 cursor-pointer hover:text-blue-700 hover:bg-hover rounded transition-colors"
                        title="Edit"
                      >
                        <TbEdit size={17} />
                      </button>
                      {isDefaultAdmin ? (
                        <span
                          className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 whitespace-nowrap cursor-default"
                          title="Default System Administrator cannot be deleted"
                        >
                          Permanent
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 hover:text-red cursor-pointer hover:bg-hover rounded transition-colors"
                          title="Delete"
                        >
                          <LuTrash2 size={17} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-text-primary/60 bg-secondary rounded-b-lg">
              No users data available
            </div>
          )}
        </div>
      </div>

      {/* Export Modal with Loading States */}
      <ExportModal
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        title="Export Users Data"
        totalCount={usersData.length}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to permanently delete this user account? They will no longer be able to log in to DailyDocket."
        itemName={
          deleteTarget
            ? `User: ${deleteTarget.fullName || deleteTarget.name} (${deleteTarget.email}) · Role: ${deleteTarget.role}`
            : ""
        }
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UsersTable;
