"use client";

import { useCategoriesVM } from "@/viewmodels/MainScreenViewModel/categories/CategoriesViewModal";
import { FaCheck, FaEdit } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import Loader from "@/components/loader";
import { FiSearch } from "react-icons/fi";

export default function CategoriesList() {
  const vm = useCategoriesVM();

  return (
    <div className="p-4 sm:p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
      <div className="bg-white rounded-xl font-bold mb-5 border border-gray-200 shadow flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6">
          <h1 className="text-lg md:text-xl font-semibold">Categories</h1>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-24 focus-within:w-96 transition-all duration-300 ease-in-out">
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Category..."
                value={vm.searchTerm}
                onChange={(e) => vm.setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 w-full border border-gray-500 rounded font-medium text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 ease-in-out"
              />
            </div>
            <button
              onClick={() => vm.setShowModal(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 cursor-pointer"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="relative flex-1 overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead className="text-left bg-gray-100 text-gray-500">
              <tr className="border-t border-gray-300">
                <th className="py-3 px-4">No.</th>
                <th className="py-3 px-4 w-5/12">Title</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vm.loading ? (
                <tr>
                  <td colSpan={4}><Loader message="Loading Categories..." /></td>
                </tr>
              ) : vm.filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">No categories found.</td>
                </tr>
              ) : (
                vm.filteredCategories.map((cat, index) => (
                  <tr key={cat.id_int} className="border-t border-b border-gray-300">
                    <td className="py-3 px-4 font-semibold text-gray-500">
                      {(vm.currentPage - 1) * 8 + index + 1}
                    </td>
                    <td className="py-3 px-4">
                      {vm.editId === cat.id_int ? (
                        <input
                          ref={vm.editInputRef}
                          value={vm.editInput}
                          onChange={(e) => vm.setEditInput(e.target.value)}
                          className="w-full px-2 py-1 rounded border border-gray-700 font-medium text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 ease-in-out"
                        />
                      ) : (
                        <span className="font-semibold">{cat.title}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className={`flex gap-1 justify-between items-center text-md font-semibold py-1 rounded ${cat.is_active ? "text-green-600" : "text-red-600"}`}>
                        <div className="flex gap-3 items-center">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={cat.is_active}
                            onClick={(e) => {
                              e.stopPropagation();
                              vm.setConfirmToggleId(cat.id_int);
                              vm.setConfirmToggleStatus(cat.is_active);
                              vm.setConfirmToggleTitle(cat.title);
                            }}
                            className={`cursor-pointer inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${cat.is_active ? "bg-green-500 scale-90" : "bg-red-500 scale-90"}`}
                          >
                            <span className={`h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${cat.is_active ? "translate-x-6" : "translate-x-1"}`} />
                          </button>
                          <div>{cat.is_active ? "Active" : "Inactive"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 flex gap-3 items-center text-lg">
                      {vm.editId === cat.id_int ? (
                        <>
                          <button onClick={() => vm.handleUpdate(cat.id_int)} className=" text-green-600 hover:text-green-500 cursor-pointer"><FaCheck /></button>
                          <button onClick={() => { vm.setEditId(null); vm.setEditInput(""); }} className="text-red-500 hover:text-red-700 cursor-pointer"><ImCancelCircle /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => vm.handleEdit(cat.id_int)} className="text-orange-500 hover:text-orange-600 cursor-pointer"><FaEdit /></button>
                          <button onClick={() => vm.promptDelete(cat.id_int, cat.title)} className="text-red-500 hover:text-red-600 cursor-pointer"><MdDelete /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end gap-2 py-4">
            <button
              onClick={() => vm.setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={vm.currentPage === 1 || vm.loading}
              className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <GrFormPrevious />
            </button>
            {[...Array(vm.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => vm.setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${vm.currentPage === i + 1 ? "bg-orange-500 text-white" : "bg-orange-100"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => vm.setCurrentPage((prev) => Math.min(prev + 1, vm.totalPages))}
              disabled={vm.currentPage === vm.totalPages || vm.loading}
              className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <GrFormNext />
            </button>
          </div>
        </div>

        {/* Add Category Modal */}
        {vm.showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          >
            <div className="bg-white rounded-xl max-w-xl w-full p-10 relative animate-slideUp">
              <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
              <label className="font-semibold">
                CATEGORIES <span className="text-red-500 text-lg animate-pulse">*</span>
              </label>
              <input
                ref={vm.addInputRef}
                type="text"
                placeholder="Category title"
                value={vm.newCategory}
                onChange={(e) => {
                  vm.setNewCategory(e.target.value);
                  vm.setCategoryError("");
                }}
                className={`w-full border px-3 py-2 rounded my-2 font-bold ${vm.categoryError ? "border-red-500" : "border-gray-500"}`}
              />
              {vm.categoryError && <p className="text-red-500 text-sm mb-2 font-bold">{vm.categoryError}</p>}
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => { vm.setShowModal(false); vm.setNewCategory(""); vm.setCategoryError(""); }} className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer">Cancel</button>
                <button onClick={vm.handleAddCategory} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 cursor-pointer">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Update Availability */}
        {vm.confirmToggleId !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          >
            <div className="bg-white rounded-xl max-w-md w-full p-6 text-center animate-slideUp">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Change Availability?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to mark <span className="font-bold text-orange-600">{vm.confirmToggleTitle}</span> as{" "}
                <span className={`font-bold ${!vm.confirmToggleStatus ? "text-green-600" : "text-red-600"}`}>
                  {!vm.confirmToggleStatus ? "Active" : "Inactive"}
                </span>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    vm.setConfirmToggleId(null);
                    vm.setConfirmToggleStatus(false);
                    vm.setConfirmToggleTitle("");
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={vm.confirmToggleAvailability}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Confirm Delete Modal */}
        {vm.confirmDeleteId !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          >            <div className="bg-white rounded-xl max-w-md w-full p-6 text-center animate-slideUp">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Are you sure you want to delete this category?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                <span className="font-bold text-red-600">{vm.confirmDeleteTitle}</span> will be permanently removed.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => vm.setConfirmDeleteId(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={vm.confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
