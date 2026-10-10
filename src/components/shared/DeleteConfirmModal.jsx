"use client";

import React, { useEffect } from "react";
import { LuTrash2, LuX, LuTriangleAlert } from "react-icons/lu";

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  confirmButtonText = "Delete",
  isLoading = false,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="bg-secondary border border-gray-700/80 rounded-2xl p-6 w-full max-w-md shadow-2xl relative transform transition-all scale-100 animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white hover:bg-hover rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          title="Cancel"
        >
          <LuX size={18} />
        </button>

        {/* Modal Header Icon */}
        <div className="flex items-center space-x-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center flex-shrink-0 shadow-inner">
            <LuTrash2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary leading-tight">
              {title}
            </h3>
            <span className="text-xs text-red-400/90 font-medium flex items-center gap-1 mt-0.5">
              <LuTriangleAlert size={12} /> Permanent Action
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="text-sm text-gray-300 mb-6 leading-relaxed">
          {message}
          {itemName && (
            <div className="mt-2.5 px-3 py-2 bg-form-bg/70 border border-gray-700/60 rounded-lg text-white font-medium text-xs break-all">
              {itemName}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-700/60">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-lg border border-gray-600 hover:bg-gray-700/60 text-gray-200 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-medium flex items-center space-x-2 shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <LuTrash2 size={16} />
                <span>{confirmButtonText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
