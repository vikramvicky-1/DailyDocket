"use client";

import React, { useState, useRef } from "react";
import {
  LuUpload,
  LuLoader,
  LuCheck,
  LuTrash2,
  LuEye,
  LuRefreshCw,
  LuFileText,
  LuImage as LuImageIcon,
} from "react-icons/lu";
import AttachmentModal from "../shared/AttachmentModal";

/**
 * AttachmentUploader
 * Reusable attachment upload field with immediate upload and real-time loading status
 */
const AttachmentUploader = ({
  label,
  value, // existing or uploaded URL
  onChange, // (url, metadata) => void
  onUploadStateChange, // (isUploading: boolean) => void
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg",
  maxSizeMB = 12,
  helpText = "Supported: PDF, Excel, Word, PNG, JPG • Max 12MB",
  placeholderText = "Drag and drop attachment or click to browse",
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  // Helper to check if a URL or name is an image
  const isImageFile = (filenameOrUrl) => {
    if (!filenameOrUrl) return false;
    const lower = filenameOrUrl.toLowerCase();
    return (
      lower.endsWith(".png") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".webp") ||
      lower.endsWith(".gif") ||
      lower.endsWith(".svg") ||
      lower.startsWith("data:image/")
    );
  };

  // Format bytes into readable format
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Core file upload function with immediate loading status
  const uploadFile = async (file) => {
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setUploadError("");
    setIsUploading(true);
    setUploadProgress(15);
    onUploadStateChange?.(true);

    // Save temporary local info for display during loading
    const tempInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      localPreview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    };
    setUploadedFileInfo(tempInfo);

    // Progress simulation while network request takes place
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      setUploadProgress(100);

      // Keep metadata
      setUploadedFileInfo({
        name: data.name || file.name,
        size: data.size || file.size,
        url: data.url,
      });

      // Notify parent of successful URL
      onChange?.(data.url, data);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload file. Please try again.");
      setUploadedFileInfo(null);
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      onUploadStateChange?.(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle file input selection
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      uploadFile(selected);
    }
  };

  // Handle Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isUploading) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  // Remove current attachment
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadedFileInfo(null);
    setUploadError("");
    onChange?.(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file picker
  const triggerFileInput = () => {
    if (!isUploading && !disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Extract display name from URL if no fileInfo
  const currentUrl = value || uploadedFileInfo?.url;
  const displayName =
    uploadedFileInfo?.name ||
    (currentUrl ? currentUrl.split("/").pop()?.split("?")[0] : "");
  const hasAttachment = Boolean(currentUrl);

  return (
    <div className="space-y-1.5 w-full min-w-0">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* UPLOADING STATE - Dedicated Loading Status Indicator */}
      {isUploading ? (
        <div className="relative w-full border-2 border-dashed border-accent bg-accent/10 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center transition-all animate-pulse">
          <div className="flex items-center space-x-3 mb-2">
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
              <LuLoader className="absolute text-accent w-4 h-4 animate-spin" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-accent flex items-center gap-1.5">
                <span>Uploading attachment...</span>
              </p>
              <p className="text-xs text-gray-300 truncate max-w-[220px] sm:max-w-xs md:max-w-sm">
                {uploadedFileInfo?.name || "Processing image..."}
              </p>
            </div>
          </div>

          {/* Animated progress bar */}
          <div className="w-full max-w-xs sm:max-w-sm bg-black/40 rounded-full h-2 overflow-hidden border border-accent/30 mt-1">
            <div
              className="bg-accent h-full transition-all duration-300 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="text-[11px] text-gray-400 mt-1.5">
            Please wait while your file is securely uploaded to the server
          </span>
        </div>
      ) : hasAttachment ? (
        /* ATTACHED STATE - Shows uploaded / existing file with preview, details & actions */
        <div className="w-full border border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60 rounded-xl p-3 sm:p-3.5 transition-all">
          <div className="flex items-center justify-between gap-3">
            {/* Thumbnail or File Icon */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {isImageFile(currentUrl) ? (
                <div
                  onClick={() => setPreviewModalOpen(true)}
                  className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 border border-emerald-500/30 flex-shrink-0 cursor-pointer group relative"
                  title="Click to preview"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentUrl}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <LuEye size={14} />
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <LuFileText size={22} />
                </div>
              )}

              {/* File details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <LuCheck size={11} /> Uploaded
                  </span>
                  {uploadedFileInfo?.size && (
                    <span className="text-[11px] text-gray-400">
                      • {formatBytes(uploadedFileInfo.size)}
                    </span>
                  )}
                </div>
                <p
                  className="text-xs sm:text-sm font-medium text-text-primary truncate mt-0.5"
                  title={displayName}
                >
                  {displayName}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  Ready for form submission
                </p>
              </div>
            </div>

            {/* Actions: View, Change, Remove */}
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(true)}
                className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-primary hover:bg-hover border border-gray-700 text-gray-300 hover:text-accent text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Preview attachment"
              >
                <LuEye size={14} />
                <span className="hidden sm:inline">View</span>
              </button>

              <button
                type="button"
                onClick={triggerFileInput}
                className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-primary hover:bg-hover border border-gray-700 text-gray-300 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Replace with new file"
              >
                <LuRefreshCw size={13} />
                <span className="hidden sm:inline">Replace</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Remove attachment"
              >
                <LuTrash2 size={13} />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* IDLE DROPZONE STATE - Clean drag & drop upload target */
        <div
          onClick={triggerFileInput}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative w-full border-2 border-dashed rounded-xl transition-all cursor-pointer p-4 sm:p-5 flex flex-col items-center justify-center text-center ${
            dragActive
              ? "border-accent bg-accent/15 scale-[1.01]"
              : "border-[#545454] hover:border-accent/80 hover:bg-hover/30 bg-form-bg"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-2">
            <LuUpload size={20} />
          </div>
          <p className="text-xs sm:text-sm font-medium text-text-primary">
            {placeholderText.split("/")[0] || placeholderText}{" "}
            <span className="text-accent underline font-semibold">
              Browse file
            </span>
          </p>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
            {helpText}
          </p>
        </div>
      )}

      {/* Error display if upload failed */}
      {uploadError && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs mt-1.5">
          <span className="truncate">⚠️ {uploadError}</span>
          <button
            type="button"
            onClick={triggerFileInput}
            className="text-xs text-accent underline ml-2 cursor-pointer flex-shrink-0"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && currentUrl && (
        <AttachmentModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          url={currentUrl}
          fileName={displayName}
          title={label || "Attachment Preview"}
        />
      )}
    </div>
  );
};

export default AttachmentUploader;
