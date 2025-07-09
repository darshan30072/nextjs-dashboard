'use client';

import { useState, useEffect } from "react";
import { getFoodItemById } from "@/action/foodItem/getFoodItemById";
import { updateFoodItem } from "@/action/foodItem/updateFoodItem";
import toast from "react-hot-toast";
import { FoodCategory } from "@/models/foodItemModel";

export type PortionPrice = {
    portion: string;
    price: string;
};

export type ExistingAttachment = {
    url: string;
    type: "image" | "video";
};

type FormErrors = {
    name: string;
    category: string;
    details: string;
    ingredients: string;
    portions: string;
    preparationTime: string;
    available?: string;
};

export function useEditFoodItemVM(id: number) {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        category: "" as FoodCategory,
        details: "",
        ingredients: [] as string[],
        portionPrices: [{ portion: "", price: "" }],
        preparationTime: "",
        available: false,
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({
        name: "",
        category: "",
        details: "",
        ingredients: "",
        portions: "",
        preparationTime: "",
    });

    const [ingredientInput, setIngredientInput] = useState("");
    const [newPortion, setNewPortion] = useState<PortionPrice>({ portion: "", price: "" });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [existingAttachments, setExistingAttachments] = useState<ExistingAttachment[]>([]);
    const [initialFormData, setInitialFormData] = useState<typeof formData | null>(null);
    const [initialAttachments, setInitialAttachments] = useState<ExistingAttachment[]>([]);

    const isEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

    useEffect(() => {
        async function fetchFoodItem() {
            setLoading(true);
            try {
                const data = await getFoodItemById(id);

                const preparedFormData = {
                    name: data.item_title || "",
                    category: data.category_id_int?.toString() || "",
                    details: data.item_description || "",
                    ingredients: Array.isArray(data.item_ingredient)
                        ? data.item_ingredient
                        : (typeof data.item_ingredient === "string" && data.item_ingredient.trim().startsWith("["))
                            ? JSON.parse(data.item_ingredient)
                            : data.item_ingredient?.split(",").map((i: string) => i.trim()) ?? [],
                    portionPrices: Array.isArray(data.portions)
                        ? data.portions.map((p: { portion_title: string; portion_price: string }) => ({
                            portion: p.portion_title || "",
                            price: String(p.portion_price || ""),
                        }))
                        : [],
                    preparationTime: data.item_prepartion_time_min != null ? String(data.item_prepartion_time_min) : "",
                    available: data.is_item_available_for_order === 1,
                };

                setFormData(preparedFormData);
                setInitialFormData(preparedFormData);

                const attachments: ExistingAttachment[] = (data.attachments || []).map((att: { file_logical_name: string }) => {
                    const url = `https://food-admin.wappzo.com/uploads/items/${att.file_logical_name}`;
                    if (/\.(mp4|webm|ogg|mov)$/i.test(att.file_logical_name)) {
                        return { url, type: "video" };
                    }
                    return { url, type: "image" };
                });

                setExistingAttachments(attachments);
                setInitialAttachments(attachments);
            } catch (error) {
                toast.error("Failed to fetch food item.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchFoodItem();
    }, [id]);

    const validateForm = () => {
        const errors: FormErrors = {
            name: "",
            category: "",
            details: "",
            ingredients: "",
            portions: "",
            preparationTime: "",
        };

        if (!formData.name.trim()) errors.name = "Item name is required";
        if (!formData.category) errors.category = "Category is required";
        if (!formData.details) errors.details = "Description is required";
        if (!formData.preparationTime) errors.preparationTime = "Preparation time is required";

        if (formData.ingredients.length === 0) errors.ingredients = "At least one ingredient is required";

        const validPortions = formData.portionPrices.filter(p => p.portion && p.price);
        if (validPortions.length === 0) errors.portions = "At least one portion with price is required";

        setFormErrors(errors);
        return Object.values(errors).every(err => err === "");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, type } = target;

        setFormErrors(prev => ({ ...prev, [name]: "" }));

        if (target instanceof HTMLInputElement && type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else if (target instanceof HTMLInputElement && type === "file") {
            const files = target.files;
            if (files && files.length > 0) {
                setSelectedFiles(prev => [...prev, ...Array.from(files)]);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: target.value }));
        }
    };

    const handleAddIngredient = () => {
        if (ingredientInput.trim()) {
            const newIngredients = ingredientInput
                .split(",")
                .map(i => i.trim())
                .filter(i => i.length > 0);
            setFormData(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, ...newIngredients],
            }));
            setIngredientInput("");
        }
    };

    const handleRemoveIngredient = (ingredient: string) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter(i => i !== ingredient),
        }));
    };

    const handlePortionChange = (index: number, field: "portion" | "price", value: string) => {
        const updated = [...formData.portionPrices];
        updated[index][field] = value;
        setFormData(prev => ({ ...prev, portionPrices: updated }));
    };

    const addPortion = (portionObj?: PortionPrice) => {
        setFormData(prev => {
            const cleanedPortions = prev.portionPrices.filter(p => p.portion.trim() !== "" && p.price.trim() !== "");
            return {
                ...prev,
                portionPrices: [...cleanedPortions, portionObj || { portion: "", price: "" }],
            };
        });
    };

    const removePortion = (index: number) => {
        setFormData(prev => ({
            ...prev,
            portionPrices: prev.portionPrices.filter((_, i) => i !== index),
        }));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExisting = (index: number) => {
        setExistingAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const toggleAvailable = () => {
        setFormData(prev => ({ ...prev, available: !prev.available }));
        setFormErrors(prev => {
            const updated = { ...prev };
            delete updated.available;
            return updated;
        });
    };

    const resetForm = () => {
        const confirmed = window.confirm("Are you sure you want to reset the form?");
        if (!confirmed) return;
        setFormData({
            name: "",
            category: "" as FoodCategory,
            details: "",
            ingredients: [],
            portionPrices: [],
            preparationTime: "",
            available: false,
        });
        setIngredientInput("");
        setNewPortion({ portion: "", price: "" });
        setFormErrors({
            name: "",
            category: "",
            details: "",
            ingredients: "",
            portions: "",
            preparationTime: "",
        });
        setSelectedFiles([]);
        setExistingAttachments([]);
    };

    const handleSubmit = async (id: number) => {
        const isValid = validateForm();
        if (!isValid) {
            toast.error("Please fill in all required fields.");
            return false;
        }

        const currentAttachments = existingAttachments;
        const initialAttachmentsNames = initialAttachments.map(a => a.url.split("/").pop());
        const currentAttachmentsNames = currentAttachments.map(a => a.url.split("/").pop());

        const isSameFormData = isEqual(formData, initialFormData);
        const isSameAttachments = isEqual(currentAttachmentsNames, initialAttachmentsNames);
        const isSameFiles = selectedFiles.length === 0;

        if (isSameFormData && isSameAttachments && isSameFiles) {
            toast("No changes detected. Nothing to update.");
            return true;
        }

        setLoading(true);
        try {
            const formPayload = new FormData();

            formPayload.append("item_title", formData.name);
            formPayload.append("category_id_int", String(Number(formData.category)));
            formPayload.append("item_description", formData.details);
            formPayload.append("item_prepartion_time_min", String(Number(formData.preparationTime)));
            formPayload.append("is_item_available_for_order", String(formData.available));
            formPayload.append("item_ingredient", JSON.stringify(formData.ingredients));

            const filteredPortions = formData.portionPrices.filter(
                (p) => p.portion.trim() !== "" && p.price.trim() !== ""
            );

            formPayload.append(
                "portions",
                JSON.stringify(
                    filteredPortions.map(p => ({
                        portion_title: p.portion,
                        portion_price: Number(p.price),
                    }))
                )
            );

            formPayload.append(
                "existing_attachments",
                JSON.stringify(existingAttachments.map(a => a.url.split("/").pop()))
            );

            selectedFiles.forEach(file => {
                formPayload.append("files", file);
            });

            await updateFoodItem(id, formPayload);
            toast.success("Food Item Updated Successfully!");
            return true;
        } catch (error) {
            toast.error("Food Item Update Failed!");
            console.error(error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        formData,
        setFormData,
        formErrors,
        handleChange,
        ingredientInput,
        setIngredientInput,
        handleAddIngredient,
        handleRemoveIngredient,
        newPortion,
        setNewPortion,
        handlePortionChange,
        addPortion,
        removePortion,
        selectedFiles,
        setSelectedFiles,
        existingAttachments,
        setExistingAttachments,
        handleDrop,
        handleRemoveFile,
        handleRemoveExisting,
        toggleAvailable,
        resetForm,
        handleSubmit,
    };
}
