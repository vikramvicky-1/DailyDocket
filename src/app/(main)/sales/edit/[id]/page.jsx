"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LuSave, LuArrowLeft } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import CustomDatePicker from "../../../../../components/ui/CustomDatePicker";
import AttachmentUploader from "../../../../../components/ui/AttachmentUploader";
import PermissionGuard from "../../../../../components/shared/PermissionGuard";
import { useData } from "../../../../../contexts/DataContext";

const EditSalePage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { sales, updateSale } = useData();

  // Form state
  const [formData, setFormData] = useState({
    date: new Date(),
    openingCash: "",
    purchaseCash: "",
    onlineCash: "",
    physicalCash: "",
    cashTransferred: "",
    closingCash: "",
    totalSale: "",
  });

  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load existing sale data from MongoDB
  useEffect(() => {
    const loadSaleData = async () => {
      setLoading(true);
      try {
        // Try to find in memory first
        const found = sales.find((s) => s._id === id || s.id === id);
        if (found) {
          setFormData({
            date: found.date ? new Date(found.date) : new Date(),
            openingCash: (found.openingCash ?? found.opening ?? 0).toString(),
            purchaseCash: (found.purchaseCash ?? found.purchase ?? 0).toString(),
            onlineCash: (found.onlineCash ?? found.onlinePayment ?? 0).toString(),
            physicalCash: (found.physicalCash ?? found.cashPayment ?? 0).toString(),
            cashTransferred: (found.cashTransferred ?? found.transferred ?? 0).toString(),
            closingCash: (found.closingCash ?? found.closing ?? 0).toString(),
            totalSale: (found.totalSales ?? found.totalSale ?? 0).toString(),
          });
          setAttachmentUrl(found.attachment);
          setLoading(false);
          return;
        }

        // Fetch from API
        const res = await fetch(`/api/sales/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            date: data.date ? new Date(data.date) : new Date(),
            openingCash: (data.openingCash ?? data.opening ?? 0).toString(),
            purchaseCash: (data.purchaseCash ?? data.purchase ?? 0).toString(),
            onlineCash: (data.onlineCash ?? data.onlinePayment ?? 0).toString(),
            physicalCash: (data.physicalCash ?? data.cashPayment ?? 0).toString(),
            cashTransferred: (data.cashTransferred ?? data.transferred ?? 0).toString(),
            closingCash: (data.closingCash ?? data.closing ?? 0).toString(),
            totalSale: (data.totalSales ?? data.totalSale ?? 0).toString(),
          });
          setAttachmentUrl(data.attachment);
        } else {
          setError("Sale record not found");
        }
      } catch (err) {
        console.error("Error loading sale:", err);
        setError("Failed to load sale details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSaleData();
    }
  }, [id, sales]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "onlineCash" || name === "physicalCash") {
        const online = name === "onlineCash" ? Number(value) || 0 : Number(prev.onlineCash) || 0;
        const physical = name === "physicalCash" ? Number(value) || 0 : Number(prev.physicalCash) || 0;
        updated.totalSale = (online + physical).toString();
      }
      return updated;
    });
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid() || submitting || isUploadingAttachment) return;

    try {
      setSubmitting(true);
      setError("");

      await updateSale(id, {
        date: formData.date,
        openingCash: formData.openingCash,
        purchaseCash: formData.purchaseCash,
        onlineCash: formData.onlineCash,
        physicalCash: formData.physicalCash,
        cashTransferred: formData.cashTransferred,
        closingCash: formData.closingCash,
        totalSale: formData.totalSale,
        attachment: attachmentUrl,
      });

      router.push("/sales");
    } catch (err) {
      console.error("Failed to update sale:", err);
      setError(err.message || "Failed to update sale record");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/sales");
  };

  const isFormValid = () => {
    return (
      formData.date !== null &&
      formData.openingCash.toString().trim() !== "" &&
      formData.purchaseCash.toString().trim() !== "" &&
      formData.onlineCash.toString().trim() !== "" &&
      formData.physicalCash.toString().trim() !== "" &&
      formData.cashTransferred.toString().trim() !== "" &&
      formData.closingCash.toString().trim() !== "" &&
      formData.totalSale.toString().trim() !== ""
    );
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-text-primary/70">Loading sale details from database...</p>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard moduleKey="sales" requiredAction="manage">
      <div className="w-full flex flex-col">
      <div className="mb-6 min-w-0">
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 text-text-primary min-w-0 flex-1">
            <button
              onClick={() => router.push("/sales")}
              className="flex items-center gap-1 text-[#BFBFBF] cursor-pointer hover:text-accent transition-colors flex-shrink-0"
            >
              <span className="text-2xl font-bold">
                <LuArrowLeft />
              </span>
              <h1 className="font-bold text-base sm:text-lg md:text-2xl whitespace-nowrap">
                Sales
              </h1>
            </button>
            <span className="text-text-primary flex-shrink-0">
              <MdKeyboardArrowRight size={18} className="sm:w-5 sm:h-5" />
            </span>
            <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">
              Edit Sale
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0 ml-1 sm:ml-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-1.5 sm:px-2 md:px-6 bg-secondary py-2 sm:py-2.5 md:py-3 border border-accent text-accent rounded-lg hover:bg-primary/70 cursor-pointer transition-colors text-xs sm:text-sm md:text-base font-medium whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-sale-form"
              disabled={!isFormValid() || submitting || isUploadingAttachment}
              className={`flex items-center gap-0.5 sm:gap-1 md:gap-2 px-1.5 sm:px-2 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-medium text-xs sm:text-sm md:text-base whitespace-nowrap ${
                isFormValid() && !submitting && !isUploadingAttachment
                  ? "cursor-pointer bg-accent hover:bg-accent/90 text-white"
                  : "cursor-not-allowed bg-accent/50 text-white/70"
              }`}
            >
              <LuSave size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>
                {isUploadingAttachment
                  ? "Uploading..."
                  : submitting
                  ? "Updating..."
                  : "Update Sale"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="flex-1 min-h-0">
        <div className="bg-secondary rounded-xl p-3 sm:p-4 md:p-6 lg:p-5 flex flex-col h-full">
          <div className="pb-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
              Edit Sale Details
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar max-h-[650px] md:max-h-[500px] lg:max-h-[510px]">
            <form
              id="edit-sale-form"
              onSubmit={handleSubmit}
              className="space-y-5 lg:space-y-6 min-w-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 min-w-0">
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <CustomDatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    placeholder="Enter Date"
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Opening Cash (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="openingCash"
                    value={formData.openingCash}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Purchase Cash (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="purchaseCash"
                    value={formData.purchaseCash}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Online Cash (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="onlineCash"
                    value={formData.onlineCash}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Physical Cash (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="physicalCash"
                    value={formData.physicalCash}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Cash Transferred (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="cashTransferred"
                    value={formData.cashTransferred}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Closing Cash (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="closingCash"
                    value={formData.closingCash}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Total Sale (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalSale"
                    value={formData.totalSale}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
              </div>

              {/* Attachment Section with live upload loading status */}
              <div className="mt-6 min-w-0">
                <AttachmentUploader
                  label="Upload Attachment (Receipt / Bill)"
                  value={attachmentUrl}
                  onChange={(url) => setAttachmentUrl(url)}
                  onUploadStateChange={setIsUploadingAttachment}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  helpText="Supported: PDF, Word, PNG, JPG • Max 12MB"
                  placeholderText="Drag and Drop Attachment Here / Choose File"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </PermissionGuard>
);
};

export default EditSalePage;
