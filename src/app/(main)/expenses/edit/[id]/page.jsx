"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LuSave, LuArrowLeft } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import CustomDatePicker from "../../../../../components/ui/CustomDatePicker";
import CustomDropdown from "../../../../../components/ui/CustomDropdown";
import AttachmentUploader from "../../../../../components/ui/AttachmentUploader";
import PermissionGuard from "../../../../../components/shared/PermissionGuard";
import { useData } from "../../../../../contexts/DataContext";

const EditExpensePage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { expenses, updateExpense, categories } = useData();

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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const loadExpense = async () => {
      setLoading(true);
      try {
        const found = expenses.find((e) => e._id === id || e.id === id);
        if (found) {
          setFormData({
            date: found.date ? new Date(found.date) : new Date(),
            category: found.category || "",
            subcategory: found.subcategory || "",
            totalAmount: (found.totalAmount ?? 0).toString(),
            status: found.status || "Paid",
            paymentMode: found.paymentMode || "Online",
            remarks: found.remarks || "-",
          });
          setAttachmentUrl(found.billAttachment);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/expenses/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            date: data.date ? new Date(data.date) : new Date(),
            category: data.category || "",
            subcategory: data.subcategory || "",
            totalAmount: (data.totalAmount ?? 0).toString(),
            status: data.status || "Paid",
            paymentMode: data.paymentMode || "Online",
            remarks: data.remarks || "-",
          });
          setAttachmentUrl(data.billAttachment);
        } else {
          setError("Expense record not found");
        }
      } catch (err) {
        console.error("Error loading expense:", err);
        setError("Failed to load expense details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadExpense();
    }
  }, [id, expenses]);

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
  const getSubcategoryOptions = () => {
    if (!isCategorySelected) return [];

    let optionsList = [];
    const foundCat = categories.find((c) => c.name === formData.category);
    const subs =
      foundCat?.subcategories?.length > 0
        ? foundCat.subcategories
        : DEFAULT_SUBCATEGORIES_MAP[formData.category] || [];
    optionsList = subs.map((s) => ({ value: s, label: s }));

    // Ensure existing subcategory from database is preserved in options if present
    if (
      formData.subcategory &&
      !optionsList.some((opt) => opt.value === formData.subcategory)
    ) {
      optionsList.unshift({
        value: formData.subcategory,
        label: formData.subcategory,
      });
    }

    return optionsList;
  };

  const subcategoryOptions = getSubcategoryOptions();

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
    if (submitting || isUploadingAttachment) return;

    try {
      setSubmitting(true);
      setError("");

      await updateExpense(id, {
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
      console.error("Failed to update expense:", err);
      setError(err.message || "Failed to update expense");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-text-primary/70">Loading expense details from database...</p>
        </div>
      </div>
    );
  }

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
              <MdKeyboardArrowRight size={18} className="sm:w-5 sm:h-5" />
            </span>
            <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">
              Edit Expense
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0 ml-1 sm:ml-2">
            <button
              type="button"
              onClick={() => router.push("/expenses")}
              className="px-1.5 sm:px-2 md:px-6 bg-secondary py-2 sm:py-2.5 md:py-3 border border-accent text-accent rounded-lg hover:bg-primary/70 cursor-pointer transition-colors text-xs sm:text-sm md:text-base font-medium whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-expense-form"
              disabled={submitting || isUploadingAttachment}
              className={`flex items-center gap-0.5 sm:gap-1 md:gap-2 px-1.5 sm:px-2 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-medium text-xs sm:text-sm md:text-base whitespace-nowrap ${
                !submitting && !isUploadingAttachment
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
                  : "Update Expense"}
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
              Edit Expense Details
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar max-h-[650px] md:max-h-[500px] lg:max-h-[510px]">
            <form
              id="edit-expense-form"
              onSubmit={handleSubmit}
              className="space-y-5 lg:space-y-6 min-w-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 min-w-0">
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

              {/* Bill Attachment with live upload loading status */}
              <div className="mt-6 min-w-0">
                <AttachmentUploader
                  label="Attachment"
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

export default EditExpensePage;
