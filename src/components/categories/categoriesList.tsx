"use client";

import { addCategory } from "@/action/category/addCategory";
import { deleteCategory } from "@/action/category/deleteCategory";
import { editCategory } from "@/action/category/editCategory";
import { getCategory } from "@/action/category/getCategory";
import { Category } from "@/interface/categoryTypes";
import { useEffect, useRef, useState } from "react";
import { FaCheck, FaEdit } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import Loader from "../loader";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { editAvailability } from "@/action/category/editAvailability";

export default function CategoriesList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [editInput, setEditInput] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [categoryError, setCategoryError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const addInputRef = useRef<HTMLInputElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);
    const itemsPerPage = 8;

    const fetchCategory = async (page: number) => {
        setLoading(true);
        try {
            const { categories, pagination } = await getCategory(page, itemsPerPage);
            // Sort by created_ata in ascending order (oldest first, newest t end)
            const sortedCategories = [...categories].sort((a, b) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            setCategories(sortedCategories);
            setTotalPages(pagination?.totalPages || 1);
        } catch (error) {
            console.error("Error fetching category:", error);
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory(currentPage);
    }, [currentPage]);


    useEffect(() => {
        if (showModal && addInputRef.current) {
            addInputRef.current.focus();
        }
    }, [showModal]);

    useEffect(() => {
        if (editId !== null && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editId]);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) {
            setCategoryError("Category name is required");
            toast.error("Category name is required");
            return;
        }
        try {
            await addCategory(newCategory.trim().toUpperCase());
            toast.success("Category added successfully!");
            setNewCategory("");
            setShowModal(false);
            await fetchCategory(currentPage);
        } catch (err) {
            toast.error("Failed to add category.");
            console.error("Error adding category:", err);
        }
    };

    const handleUpdate = async (id: number) => {
        const trimmedInput = editInput.trim().toUpperCase();
        if (!trimmedInput) return;

        const currentCategory = categories.find(cat => cat.id_int === id);
        if(currentCategory && currentCategory.title.toUpperCase() === trimmedInput) {
            // No change made, just exit mode without toast
            setEditId(null);
            setEditInput("");
            return;
        }

        try {
            await editCategory(id, trimmedInput);
            toast.success("Category updated successfully!");
            setEditId(null);
            setEditInput("");
            fetchCategory(currentPage);
        } catch (err) {
            toast.error("Failed to update category.");
            console.error(err);
        }
    };

    const handleEdit = (id: number) => {
        const target = categories.find(cat => cat.id_int === id);
        if (target) {
            setEditId(id);
            setEditInput(target.title);
        }
    };

    const handleCancel = () => {
        setEditId(null);
        setEditInput("");
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        const originalCategories = [...categories];
        setCategories(prev => prev.filter(cat => cat.id_int !== id));
        try {
            await deleteCategory(id);
            toast.success("Category deleted successfully!");
            fetchCategory(currentPage);
        } catch (error) {
            toast.error("Failed to delete category.");
            console.error(error);
            setCategories(originalCategories);
        }
    };

    const filteredCategories = categories.filter(cat =>
        (cat.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggle = async (id: number, currentStatus: boolean) => {
        try {
            const updated = await editAvailability(id, currentStatus);

            setCategories(prev =>
                prev.map(cat =>
                    cat.id_int === id ? { ...cat, is_active: updated.is_active } : cat
                )
            );
            toast.success(`Category marked as ${updated.is_active ? "Active" : "Inactive"}`);
            fetchCategory(currentPage);
        } catch (err) {
            toast.error("Failed to toggle availability");
            console.error(err);
        }
    };

    return (
        <div className="bg-white rounded-xl font-bold mb-5 border border-gray-200 shadow flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6">
                <h1 className="text-lg md:text-xl font-semibold">Categories</h1>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 rounded border font-medium text-sm"
                    />
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                    >
                        Add Category
                    </button>
                </div>
            </div>

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
                        {loading ? (
                            <tr>
                                <td colSpan={4}><Loader message="Loading Categories..." /></td>
                            </tr>
                        ) : filteredCategories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-6 text-gray-500">
                                    No categories found.
                                </td>
                            </tr>
                        ) : (
                            filteredCategories.map((cat, index) => (
                                <tr key={cat.id_int} className="border-t border-b border-gray-300">
                                    <td className="py-3 px-4 font-semibold text-gray-500">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </td>
                                    <td className="py-3 px-4">
                                        {editId === cat.id_int ? (
                                            <input
                                                ref={editInputRef}
                                                value={editInput}
                                                onChange={(e) => setEditInput(e.target.value)}
                                                className="w-full px-2 py-1 rounded"
                                            />
                                        ) : (
                                            <span className="font-semibold">{cat.title}</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div
                                            className={`flex gap-1 justify-between items-center text-md font-semibold py-1 rounded ${cat.is_active
                                                ? "text-green-700"
                                                : "text-red-700"
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={cat.is_active}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggle(cat.id_int, cat.is_active);
                                                    }}
                                                    className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${cat.is_active ? "bg-green-500" : "bg-red-500"
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${cat.is_active ? "translate-x-6" : "translate-x-1"
                                                            }`}
                                                    />
                                                </button>
                                                <div>{cat.is_active ? "Active" : "Inactive"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 flex gap-3 items-center text-lg">
                                        {editId === cat.id_int ? (
                                            <>
                                                <button onClick={() => handleUpdate(cat.id_int)} className="text-green-600 hover:text-green-500">
                                                    <FaCheck />
                                                </button>
                                                <button onClick={handleCancel} className="text-red-500 hover:text-red-700">
                                                    <ImCancelCircle />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(cat.id_int)} className="text-orange-500 hover:text-orange-600">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(cat.id_int)} className="text-red-500 hover:text-red-600">
                                                    <MdDelete />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center gap-2 py-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || loading}
                        className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                        <GrFormPrevious />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-orange-500 text-white" : "bg-orange-100"}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || loading}
                        className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                        <GrFormNext />
                    </button>
                </div>
            </div>

            {/* Add Category Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 justify-center items-center p-4"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                >
                    <div className="flex items-center justify-center animate-fadeIn h-full">
                        <div className="bg-white rounded-xl max-w-xl w-full p-10 relative animate-slideUp">
                            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
                            <input
                                ref={addInputRef}
                                type="text"
                                placeholder="Category title"
                                value={newCategory}
                                onChange={(e) => {
                                    setNewCategory(e.target.value);
                                    setCategoryError("");
                                }}
                                className={`w-full border px-3 py-2 rounded mb-2 ${categoryError ? "border-red-500" : "border-gray-500"}`}
                            />
                            {categoryError && (
                                <p className="text-red-500 text-sm mb-2 font-semibold">{categoryError}</p>
                            )}
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setNewCategory("");
                                        setCategoryError("");
                                    }}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddCategory}
                                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
