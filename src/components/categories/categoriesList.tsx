"use client";

import { addCategory } from "@/action/category/addCategory";
import { deleteCategory } from "@/action/category/deleteCategory";
import { editCategory } from "@/action/category/editCategory";
import { getCategory } from "@/action/category/getCategory";
import { Category } from "@/interface/categoryTypes";
import { useEffect, useState } from "react";
import { FaCheck, FaEdit } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import Loader from "../loader";

export default function CategoriesList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [editInput, setEditInput] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [categoryError, setCategoryError] = useState("");

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const data = await getCategory();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching category:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newCategory.trim()) {
            setCategoryError("Category name is required");
            toast.error("Category name is required");
            return;
        }
        setCategoryError("");

        try {
            const data = await addCategory(newCategory.trim().toUpperCase());
            console.log("Category added : ", data);
            toast.success("Category added successfully!");
            setNewCategory("");
            setShowModal(false);
            await fetchCategory();
        } catch (err) {
            toast.error("Failed to add category.");
            console.error("Error adding Catrgories : ", err);
        };
    };

    const handleUpdate = async (id: number) => {
        const original = categories.find(cat => cat.id_int === id);
        const trimmedInput = editInput.trim().toUpperCase();

        // If input is empty or unchanged, skip update
        if (!trimmedInput || trimmedInput === original?.title.toUpperCase()) {
            // Optionally close edit mode without toast
            setEditId(null);
            setEditInput("");
            return;
        }
        try {
            const data = await editCategory(id, editInput.trim().toUpperCase());
            console.log("Edit data: ", data);
            toast.success("Category Updated successfully!");
            await fetchCategory();
            setEditId(null);
            setEditInput("");
        } catch (err) {
            toast.error("Failed to update category : ");
            console.error("Failed to update category : ", err);
        }
    };

    const handleEdit = (id: number) => {
        const target = categories.find((cat) => cat.id_int === id);
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
        const shouldDelete = confirm("Are you sure you want to delete this category?");
        if (!shouldDelete) return;

        const originalCategories = [...categories];
        setCategories(prev => prev.filter(cat => cat.id_int !== id));

        try {
            await deleteCategory(id);
            console.log("Category deleted:", id);
            toast.success("Category Deleted Successfully!");
        } catch (error) {
            toast.error("Failed to delete category.")
            console.error("Failed to delete category:", error);
            setCategories(originalCategories);
        }
    };

    return (
        <div className="bg-white rounded-xl font-bold mb-5 border border-gray-200 h-screen flex flex-col">
            <div className="flex flex-row justify-between items-start sm:items-center p-4 sm:p-6">
                <h1 className="text-lg md:text-xl font-semibold mb-2 sm:mb-0">Categories</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-orange-500 text-white px-3 py-1 lg:px-4 lg:py-2  rounded hover:bg-orange-600 cursor-pointer"
                >
                    Add Category
                </button>
            </div>

            {/* Responsive Table */}
            <div className="relative flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
                <table className="min-w-full table-auto">
                    <thead className="text-left">
                        <tr className="border-t border-gray-300 bg-gray-100 text-gray-400">
                            <th className="py-3 px-4 sm:px-6 font-medium w-2/12">ID</th>
                            <th className="py-3 px-4 sm:px-6 font-medium w-8/12">TITLE</th>
                            <th className="py-3 px-4 sm:px-6 font-medium w-2/12">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, index) => (
                            <tr key={cat.id_int} className="border-t border-b border-gray-300 xs:text-sm lg:text-md">
                                <td className="py-3 px-4 sm:px-6 text-gray-400 font-semibold">{index + 1}</td>
                                <td className="py-3 px-4 sm:px-6">
                                    {editId === cat.id_int ? (
                                        <input
                                            type="text"
                                            value={editInput}
                                            onChange={(e) => setEditInput(e.target.value)}
                                            className="border border-gray-500 px-2 py-1 rounded font-semibold w-full"
                                        />
                                    ) : (
                                        <span className="font-semibold">{cat.title}</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 sm:px-6 text-lg">
                                    {editId === cat.id_int ? (
                                        <div className="flex gap-3 sm:gap-4 items-center">
                                            <button
                                                onClick={() => handleUpdate(cat.id_int)}
                                                className="text-green-500 hover:text-green-600 cursor-pointer"
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="text-red-500 hover:text-red-600 cursor-pointer"
                                            >
                                                <ImCancelCircle />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3 sm:gap-4 items-center">
                                            <button
                                                onClick={() => handleEdit(cat.id_int)}
                                                className="text-orange-500 hover:text-orange-600 cursor-pointer"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id_int)}
                                                className="text-red-500 hover:text-red-600 cursor-pointer"
                                                title="Delete"
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {loading ? (
                            <tr>
                                <td colSpan={3}>
                                    <Loader message="Loading Categories..." />
                                </td>
                            </tr>
                        ) : (
                            categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center text-xl py-6 text-gray-500">
                                        No categories found.
                                    </td>
                                </tr>
                            )
                        )}

                    </tbody>
                </table>

                {/* Modal */}
                {showModal && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 items-center p-4"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                    >
                        <div className="flex items-center justify-center animate-fadeIn h-full">
                            <div className="bg-white rounded-xl max-w-xl w-full p-10 relative animate-slideUp">
                                <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
                                <label className="font-semibold block mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter category name"
                                    value={newCategory}
                                    onChange={(e) => {
                                        setNewCategory(e.target.value)
                                        setCategoryError("");
                                    }}
                                    className={`w-full border border-gray-500 px-3 py-2 rounded mb-1 font-semibold ${categoryError ? "border-red-500" : "border-gray-500"}`}
                                />
                                {categoryError && (
                                    <p className="text-red-500 text-sm mb-4 font-medium">{categoryError}</p>
                                )}
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border rounded hover:bg-gray-100 font-semibold cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddCategory}
                                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-semibold cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}