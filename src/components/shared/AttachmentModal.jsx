"use client";

import React, { useEffect, useState } from "react";
import {
  LuX,
  LuDownload,
  LuExternalLink,
  LuFileText,
  LuEye,
} from "react-icons/lu";

const AttachmentModal = ({
  isOpen,
  onClose,
  url,
  title = "Attachment Preview",
  fileName,
}) => {
  const [downloading, setDownloading] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !url) return null;

  // Extract clean file name if not provided
  const resolvedFileName =
    fileName ||
    url.split("/").pop()?.split("?")[0] ||
    "attachment";

  // Check file type
  const lowerUrl = url.toLowerCase();
  const isImage =
    lowerUrl.endsWith(".jpg") ||
    lowerUrl.endsWith(".jpeg") ||
    lowerUrl.endsWith(".png") ||
    lowerUrl.endsWith(".webp") ||
    lowerUrl.endsWith(".gif") ||
    lowerUrl.endsWith(".svg") ||
    url.startsWith("data:image/");

  const isPdf = lowerUrl.endsWith(".pdf");

  // Handle file download
  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = resolvedFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Direct download failed, falling back to open:", err);
      const link = document.createElement("a");
      link.href = url;
      link.download = resolvedFileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-secondary border border-gray-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700/60 bg-form-bg/60">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-accent/20 text-accent flex items-center justify-center flex-shrink-0">
              <LuEye size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-text-primary truncate">
                {title}
              </h3>
              <p className="text-xs text-gray-400 truncate max-w-xs sm:max-w-md">
                {resolvedFileName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm cursor-pointer shadow-md shadow-accent/20"
              title="Download Attachment"
            >
              <LuDownload size={16} />
              <span>{downloading ? "Downloading..." : "Download"}</span>
            </button>

            {/* Open in new tab */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white hover:bg-hover rounded-lg transition-colors"
              title="Open original file in new tab"
            >
              <LuExternalLink size={18} />
            </a>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-hover rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <LuX size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content / Preview */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-black/30 min-h-[300px]">
          {isImage ? (
            <div className="max-w-full max-h-[70vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={title}
                className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-lg border border-gray-700/50"
              />
            </div>
          ) : isPdf ? (
            <div className="w-full h-[68vh] flex flex-col">
              <iframe
                src={url}
                title={title}
                className="w-full h-full rounded-lg border border-gray-700 bg-white"
              />
            </div>
          ) : (
            <div className="text-center py-12 px-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-form-bg border border-gray-700/60 flex items-center justify-center text-accent mb-4 shadow-inner">
                <LuFileText size={40} />
              </div>
              <h4 className="text-lg font-semibold text-text-primary mb-1">
                {resolvedFileName}
              </h4>
              <p className="text-sm text-gray-400 mb-6 max-w-md">
                Preview is not directly embeddable for this file type. You can download or open it directly.
              </p>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm cursor-pointer shadow-lg shadow-accent/20"
              >
                <LuDownload size={18} />
                <span>Download File</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-700/60 bg-form-bg/40 text-xs text-gray-400">
          <span className="truncate">Source: {url}</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md hover:bg-gray-700/50 text-gray-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;
