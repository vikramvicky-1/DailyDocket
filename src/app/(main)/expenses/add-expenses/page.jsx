"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LuSave, LuArrowLeft } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import CustomDatePicker from "../../../../components/ui/CustomDatePicker";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import AttachmentUploader from "../../../../components/ui/AttachmentUploader";
import PermissionGuard from "../../../../components/shared/PermissionGuard";
import { useData } from "../../../../contexts/DataContext";

const AddExpensesPage = () => {
  const router = useRouter();
  const { addExpense, categories } = useData();

  // Form state
  const [formData, setFormData] = useState({
    date: new Date(),
    category: "",
    subcategory: "",
    totalAmount: "",
    status: "Paid",
    paymentMode: "Online",
    remarks: "",
  });

  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Category options from database + fallback
  const categoryOptions =
    categories.length > 0
      ? categories.map((c) => ({ value: c.name, label: c.name }))
      : [
          { value: "Masala Materials", label: "Masala Materials" },
          { value: "Powder", label: "Powder" },
          { value: "Snacks", label: "Snacks" },
          { value: "Vegetables", label: "Vegetables" },
          { value: "Packaging", label: "Packaging" },
          { value: "Utilities", label: "Utilities" },
        ];

  const statusOptions = [
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
  ];

  const paymentModeOptions = [
    { value: "Online", label: "Online" },
    { value: "Cash", label: "Cash" },
  ];

  const DEFAULT_SUBCATEGORIES_MAP = {
    "Masala Materials": ["Spices", "Chili", "Turmeric"],
    "Powder": ["Rice Powder", "Flour", "Corn Starch"],
    "Snacks": ["Chips", "Namkeen", "Biscuits"],
    "Vegetables": ["Potatoes", "Onions", "Tomatoes"],
    "Packaging": ["Boxes", "Pouches", "Tape"],
    "Utilities": ["Electricity", "Water", "Gas"],
  };

  const isCategorySelected = Boolean(formData.category && formData.category.trim() !== "");

  // Derive subcategory options strictly for the selected category
  const subcategoryOptions = (() => {
    if (!isCategorySelected) return [];

    const foundCat = categories.find((c) => c.name === formData.category);
    const subs =
      foundCat?.subcategories?.length > 0
        ? foundCat.subcategories
        : DEFAULT_SUBCATEGORIES_MAP[formData.category] || [];
    return subs.map((s) => ({ value: s, label: s }));
  })();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "category") {
        // Reset subcategory when category changes or is cleared
        updated.subcategory = "";
      }
      return updated;
    });
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid() || submitting || isUploadingAttachment) return;

    try {
      setSubmitting(true);
      setError("");

      await addExpense({
        date: formData.date,
        category: formData.category,
        subcategory: formData.subcategory,
        totalAmount: Number(formData.totalAmount) || 0,
        status: formData.status,
        paymentMode: formData.paymentMode,
        remarks: formData.remarks || "-",
        billAttachment: attachmentUrl,
      });

      router.push("/expenses");
    } catch (err) {
      console.error("Failed to add expense:", err);
      setError(err.message || "Failed to save expense to database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/expenses");
  };

  const isFormValid = () => {
    return (
      formData.date !== null &&
      formData.category.trim() !== "" &&
      formData.totalAmount.toString().trim() !== "" &&
      formData.status !== "" &&
      formData.paymentMode !== ""
    );
  };

  return (
    <PermissionGuard moduleKey="expenses" requiredAction="manage">
      <div className="w-full flex flex-col">
        <div className="mb-6 min-w-0">
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 text-text-primary min-w-0 flex-1">
            <button
              onClick={() => router.push("/expenses")}
              className="flex items-center gap-1 text-[#BFBFBF] cursor-pointer hover:text-accent transition-colors flex-shrink-0"
            >
              <span className="text-2xl font-bold">
                <LuArrowLeft />
              </span>
              <h1 className="font-bold text-base sm:text-lg md:text-2xl whitespace-nowrap">
                Expenses
              </h1>
            </button>
            <span className="text-text-primary flex-shrink-0">
              <MdKeyboardArrowRight size={20} />
            </span>
            <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">
              Add Expense
            </h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 flex-shrink-0 ml-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-1.5 sm:px-2 md:px-6 bg-secondary py-2 sm:py-2.5 md:py-3 border border-accent text-accent rounded-lg hover:bg-primary/70 cursor-pointer transition-colors text-xs sm:text-sm md:text-base font-medium whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-expense-form"
              disabled={!isFormValid() || submitting || isUploadingAttachment}
              className={`flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 sm:px-2 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-medium text-xs sm:text-sm md:text-base whitespace-nowrap ${
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
                  ? "Saving..."
                  : "Save Expense"}
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
              Add Expense Details
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar max-h-[650px] md:max-h-[500px] lg:max-h-[510px]">
            <form
              id="add-expense-form"
              onSubmit={handleSubmit}
              className="space-y-5 lg:space-y-6 min-w-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 min-w-0">
                {/* Date */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Expense Date <span className="text-red-500">*</span>
                  </label>
                  <CustomDatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    placeholder="Enter Date"
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                  />
                </div>

                {/* Category Dropdown */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <CustomDropdown
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    options={categoryOptions}
                    placeholder="Select Category"
                    required
                  />
                </div>

                {/* Subcategory */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Subcategory / Vendor Name{" "}
                    {!isCategorySelected && (
                      <span className="text-xs text-gray-400 font-normal">
                        (Select category first)
                      </span>
                    )}
                  </label>
                  <CustomDropdown
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    options={subcategoryOptions}
                    disabled={!isCategorySelected}
                    placeholder={
                      !isCategorySelected
                        ? "Select Category first"
                        : subcategoryOptions.length > 0
                        ? "Select Subcategory"
                        : "No subcategories available"
                    }
                  />
                </div>

                {/* Total Amount */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Total Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Payment Status <span className="text-red-500">*</span>
                  </label>
                  <CustomDropdown
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    options={statusOptions}
                    placeholder="Select Status"
                    required
                  />
                </div>

                {/* Payment Mode */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Payment Mode <span className="text-red-500">*</span>
                  </label>
                  <CustomDropdown
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleInputChange}
                    options={paymentModeOptions}
                    placeholder="Select Mode"
                    required
                  />
                </div>

                {/* Remarks */}
                <div className="space-y-2 min-w-0 lg:col-span-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Remarks / Notes
                  </label>
                  <input
                    type="text"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    placeholder="Optional notes or remarks"
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
              </div>

              {/* Bill Upload with live upload loading status */}
              <div className="mt-6 min-w-0">
                <AttachmentUploader
                  label="Upload Bill Attachment"
                  value={attachmentUrl}
                  onChange={(url) => setAttachmentUrl(url)}
                  onUploadStateChange={setIsUploadingAttachment}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  helpText="Supported: PDF, Excel, Word, PNG, JPG • Max 12MB"
                  placeholderText="Drag and Drop Bill / Choose File"
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

export default AddExpensesPage;
