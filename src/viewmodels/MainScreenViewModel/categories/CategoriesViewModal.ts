import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Category } from "@/models/categoriesModel";
import { addCategory, deleteCategory, editAvailability, editCategory, getCategory } from "@/services/categoriesService";

export function useCategoriesVM() {
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

    const fetchCategory = async (page: number) => {
        setLoading(true);
        try {
            const { categories, pagination } = await getCategory(page, itemsPerPage);
            const sorted = [...categories].sort((a, b) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            setCategories(sorted);
            setTotalPages(pagination?.totalPages || 1);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async () => {
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
            toast.error("Failed to add category");
            console.error(err);
        }
    };

    const handleEdit = (id: number) => {
        const target = categories.find(c => c.id_int === id);
        if (target) {
            setEditId(id);
            setEditInput(target.title);
        }
    };

    const handleUpdate = async (id: number) => {
        const value = editInput.trim().toUpperCase();
        if (!value) return;

        const current = categories.find(c => c.id_int === id);
        if (current && current.title.toUpperCase() === value) {
            setEditId(null);
            setEditInput("");
            return;
        }

        try {
            await editCategory(id, value);
            toast.success("Category updated successfully");
            setEditId(null);
            setEditInput("");
            await fetchCategory(currentPage);
        } catch (err) {
            toast.error("Failed to update category");
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        const original = [...categories];
        setCategories(prev => prev.filter(c => c.id_int !== id));
        try {
            await deleteCategory(id);
            toast.success("Category deleted successfully");
            await fetchCategory(currentPage);
        } catch (err) {
            toast.error("Failed to delete category");
            console.error(err);
            setCategories(original);
        }
    };

    const handleToggle = async (id: number, status: boolean) => {
        try {
            const updated = await editAvailability(id, status);
            setCategories(prev =>
                prev.map(c =>
                    c.id_int === id ? { ...c, is_active: updated.is_active } : c
                )
            );
            toast.success(`Category marked as ${updated.is_active ? "Active" : "Inactive"}`);
            await fetchCategory(currentPage);
        } catch (err) {
            toast.error("Failed to toggle availability");
            console.error(err);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        categories,
        loading,
        editId,
        editInput,
        newCategory,
        showModal,
        categoryError,
        currentPage,
        totalPages,
        searchTerm,
        addInputRef,
        editInputRef,
        filteredCategories,
        setSearchTerm,
        setShowModal,
        setNewCategory,
        setCategoryError,
        setEditInput,
        setEditId,
        setCurrentPage,
        handleAddCategory,
        handleEdit,
        handleUpdate,
        handleDelete,
        handleToggle
    };
}
