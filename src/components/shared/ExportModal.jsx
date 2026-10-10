"use client";

import React, { useState } from "react";
import { FaFileExcel } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { LuLoader, LuX, LuDownload, LuFileSpreadsheet } from "react-icons/lu";

/**
 * Reusable ExportModal with interactive loading spinners for Excel and PDF exports
 */
const ExportModal = ({
  isOpen,
  onClose,
  title = "Export Data",
  description = "Choose your preferred export format for this table.",
  totalCount = 0,
  onExportExcel,
  onExportPdf,
}) => {
  const [exportingType, setExportingType] = useState(null); // 'excel' | 'pdf' | null

  if (!isOpen) return null;

  const isBusy = Boolean(exportingType);

  const handleExcel = async () => {
    if (isBusy || !onExportExcel) return;
    try {
      setExportingType("excel");
      await new Promise((r) => setTimeout(r, 200)); // allow spinner to render
      await onExportExcel();
      onClose();
    } catch (err) {
      console.error("Excel export error:", err);
      alert("Failed to export Excel: " + (err.message || "Unknown error"));
    } finally {
      setExportingType(null);
    }
  };

  const handlePdf = async () => {
    if (isBusy || !onExportPdf) return;
    try {
      setExportingType("pdf");
      await new Promise((r) => setTimeout(r, 200)); // allow spinner to render
      await onExportPdf();
      onClose();
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Failed to generate PDF: " + (err.message || "Unknown error"));
    } finally {
      setExportingType(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (!isBusy && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-secondary border border-gray-700/80 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isBusy}
          className={`absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-hover ${
            isBusy ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
          }`}
          title="Close"
        >
          <LuX size={18} />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent flex-shrink-0">
            <LuDownload size={20} />
          </div>
          <div className="min-w-0 pr-6">
            <h3 className="text-lg font-bold text-text-primary truncate">
              {title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {description}
            </p>
          </div>
        </div>

        {/* Record count indicator */}
        <div className="flex items-center justify-between px-3 py-2 bg-primary/70 border border-gray-700/60 rounded-lg text-xs text-gray-300 mb-4">
          <span className="flex items-center gap-1.5">
            <LuFileSpreadsheet size={14} className="text-accent" />
            <span>Records to export:</span>
          </span>
          <span className="font-semibold text-accent">{totalCount} items</span>
        </div>

        {/* Export Options with active loading indicators */}
        <div className="space-y-3">
          {/* Export to Excel Button */}
          <button
            type="button"
            onClick={handleExcel}
            disabled={isBusy}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
              exportingType === "excel"
                ? "bg-green-500/15 border-green-500/50 cursor-wait shadow-md shadow-green-500/10"
                : isBusy
                ? "bg-primary/40 border-gray-700/40 opacity-50 cursor-not-allowed"
                : "bg-primary hover:bg-hover border-gray-700/70 hover:border-green-500/50 cursor-pointer shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center text-green-400 flex-shrink-0 border border-green-500/20">
                <FaFileExcel size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  Microsoft Excel (.xlsx)
                </p>
                <p className="text-[11px] text-gray-400">
                  Formatted spreadsheet with automated column widths
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 ml-2">
              {exportingType === "excel" ? (
                <div className="flex items-center space-x-1.5 text-xs text-green-400 font-medium">
                  <LuLoader className="animate-spin" size={15} />
                  <span className="hidden sm:inline">Exporting...</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400 group-hover:text-green-400 font-medium px-2 py-1 bg-form-bg rounded border border-gray-700">
                  Export
                </span>
              )}
            </div>
          </button>

          {/* Export to PDF Button */}
          <button
            type="button"
            onClick={handlePdf}
            disabled={isBusy}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
              exportingType === "pdf"
                ? "bg-red-500/15 border-red-500/50 cursor-wait shadow-md shadow-red-500/10"
                : isBusy
                ? "bg-primary/40 border-gray-700/40 opacity-50 cursor-not-allowed"
                : "bg-primary hover:bg-hover border-gray-700/70 hover:border-red-500/50 cursor-pointer shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400 flex-shrink-0 border border-red-500/20">
                <FaFilePdf size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  A4 PDF Document (.pdf)
                </p>
                <p className="text-[11px] text-gray-400">
                  Structured A4 landscape table with branded headers & page numbering
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 ml-2">
              {exportingType === "pdf" ? (
                <div className="flex items-center space-x-1.5 text-xs text-red-400 font-medium">
                  <LuLoader className="animate-spin" size={15} />
                  <span className="hidden sm:inline">Generating...</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400 group-hover:text-red-400 font-medium px-2 py-1 bg-form-bg rounded border border-gray-700">
                  Export
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Footer info note */}
        <div className="mt-4 pt-3 border-t border-gray-700/50 flex items-center justify-between text-[11px] text-gray-400">
          <span>A4 print-ready output</span>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
