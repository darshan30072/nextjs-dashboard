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

    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");

    const [confirmToggleId, setConfirmToggleId] = useState<number | null>(null);
    const [confirmToggleStatus, setConfirmToggleStatus] = useState<boolean | null>(null);
    const [confirmToggleTitle, setConfirmToggleTitle] = useState<string | null>(null);

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
            setCategoryError("Category title is required");
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

    const promptDelete = (id: number, title: string) => {
        setConfirmDeleteId(id);
        setConfirmDeleteTitle(title);
    };

    const confirmDelete = async () => {
        if (confirmDeleteId === null) return;
        const id = confirmDeleteId;
        const original = [...categories];
        setCategories(prev => prev.filter(c => c.id_int !== id));
        try {
            await deleteCategory(id);
            toast.success("Category deleted successfully");
            await fetchCategory(currentPage);
        } catch (err) {
            console.error(err)
            toast.error("Failed to delete category");
            setCategories(original);
        } finally {
            setConfirmDeleteId(null);
            setConfirmDeleteTitle("");
        }
    };

    const confirmToggleAvailability = async () => {
        if (confirmToggleId === null || confirmToggleStatus === null) return;

        try {
            const updatedCategory = await editAvailability(confirmToggleId, confirmToggleStatus);

            setCategories(prev =>
                prev.map(c =>
                    c.id_int === confirmToggleId
                        ? { ...c, is_active: updatedCategory.is_active }
                        : c
                )
            );

            toast.success(`Category marked as ${updatedCategory.is_active ? "Active" : "Inactive"}`);
        } catch (err) {
            toast.error("Failed to toggle availability");
            console.error(err);
        } finally {
            setConfirmToggleId(null);
            setConfirmToggleStatus(false);
            setConfirmToggleTitle("");
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
        confirmDeleteId,
        confirmDeleteTitle,
        setConfirmDeleteId,
        promptDelete,
        confirmDelete,
        confirmToggleId,
        confirmToggleStatus,
        confirmToggleTitle,
        setConfirmToggleId,
        setConfirmToggleStatus,
        setConfirmToggleTitle,
        confirmToggleAvailability,
    };
}
