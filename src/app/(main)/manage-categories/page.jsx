"use client";

import React, { useState } from "react";
import { LuPlus, LuTrash2, LuLayers, LuTag } from "react-icons/lu";
import { useData } from "../../../contexts/DataContext";
import { useAuth } from "../../../contexts/AuthContext";
import CategoriesSkeleton from "../../../components/categories/CategoriesSkeleton";
import DeleteConfirmModal from "../../../components/shared/DeleteConfirmModal";
import PermissionGuard from "../../../components/shared/PermissionGuard";

const ManageCategoriesPage = () => {
  const { categories, addCategory, deleteCategory, loading } = useData();
  const { canManage } = useAuth();
  const canManageCategories = canManage("categories");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [subcategoriesInput, setSubcategoriesInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim() || submitting) return;

    try {
      setSubmitting(true);
      setError("");

      const subs = subcategoriesInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await addCategory({
        name: newCategoryName.trim(),
        subcategories: subs,
      });

      setNewCategoryName("");
      setSubcategoriesInput("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add category:", err);
      setError(err.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (cat) => {
    setDeleteTarget(cat);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteCategory(deleteTarget._id || deleteTarget.id || deleteTarget.name);
      setDeleteTarget(null);
    } catch (err) {
      alert("Failed to delete category: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PermissionGuard moduleKey="categories" requiredAction="view">
      <div className="w-full max-w-full">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <LuLayers className="text-accent" />
              <span>Manage Categories</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Organize expense categories and subcategories used across DailyDocket
            </p>
          </div>

          {canManageCategories && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm cursor-pointer shadow-lg shadow-accent/20"
            >
              <LuPlus size={18} />
              <span>Add New Category</span>
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Categories Grid */}
        {loading ? (
          <CategoriesSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.length > 0 ? (
              categories.map((cat, index) => (
              <div
                key={cat._id || cat.id || index}
                className="bg-secondary border border-gray-700/60 rounded-xl p-5 flex flex-col justify-between hover:border-accent/40 transition-all shadow-md group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-bold">
                        <LuTag size={18} />
                      </div>
                      <h3 className="font-semibold text-text-primary text-base">
                        {cat.name}
                      </h3>
                    </div>

                    {canManageCategories && (
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-hover rounded-lg transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <LuTrash2 size={16} />
                      </button>
                    )}
                  </div>

                {/* Subcategories list */}
                <div className="mt-4">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-2">
                    Subcategories ({cat.subcategories?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                    {cat.subcategories && cat.subcategories.length > 0 ? (
                      cat.subcategories.map((sub, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs rounded-full bg-form-bg text-gray-300 border border-gray-600/60"
                        >
                          {sub}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">
                        No subcategories specified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center text-gray-400 bg-secondary rounded-xl border border-gray-700/60">
            <LuLayers className="w-12 h-12 mx-auto text-gray-500 mb-3 opacity-60" />
            <p className="text-base font-medium">No categories available yet.</p>
            <p className="text-sm text-gray-500 mt-1">
              Click &quot;Add New Category&quot; to create your first expense category.
            </p>
          </div>
        )}
      </div>
    )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-secondary border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <h2 className="text-xl font-bold text-text-primary mb-1">
              Add Expense Category
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              Categories help organize your business spending in reports and dashboards.
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Raw Materials or Logistics"
                  className="w-full h-11 px-4 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">
                  Subcategories (comma separated)
                </label>
                <input
                  type="text"
                  value={subcategoriesInput}
                  onChange={(e) => setSubcategoriesInput(e.target.value)}
                  placeholder="e.g. Cardboard, Bubble Wrap, Tape"
                  className="w-full h-11 px-4 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm"
                />
                <span className="text-[11px] text-gray-400 block">
                  Separate multiple subcategories with commas.
                </span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-700/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newCategoryName.trim()}
                  className="px-5 py-2 text-sm bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Expense Category"
        message="Are you sure you want to permanently delete this category? Expenses categorized under this name might need re-categorization."
        itemName={
          deleteTarget
            ? `Category: ${deleteTarget.name} (${deleteTarget.subcategories?.length || 0} subcategories)`
            : ""
        }
        isLoading={isDeleting}
      />
    </div>
    </PermissionGuard>
  );
};

export default ManageCategoriesPage;
