'use client';

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FoodCategory } from "@/models/foodItemModel";
import { getFoodItemById, updateFoodItem } from "@/services/foodItemService";

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
    portions?: string;
    preparationTime: string;
    available?: string;
};

export function useEditFoodItemVM(id: number) {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<{
        name: string;
        category: FoodCategory;
        details: string;
        ingredients: string[];
        portionPrices: PortionPrice[];
        preparationTime: string;
        available: boolean;
    }>({
        name: "",
        category: "" as FoodCategory,
        details: "",
        ingredients: [],
        portionPrices: [],
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
    const [removedAttachments, setRemovedAttachments] = useState<string[]>([]);
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
                        ? data.portions
                            .map((p: { portion_title: string; portion_price: string }) => ({
                                portion: p.portion_title || "",
                                price: String(p.portion_price || ""),
                            }))
                            .filter((p: { portion: string; price: string; }) => p.portion.trim() !== "" || p.price.trim() !== "") // <-- filter here!
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

        if (formData.ingredients.length === 0) {
            errors.ingredients = "At least one ingredient is required";
        } else {

        }

        const validPortions = formData.portionPrices.filter(p => p.portion && p.price);
        if (validPortions.length === 0) errors.portions = "At least one portion with price is required";

        const prepTime = Number(formData.preparationTime);
        if (!formData.preparationTime.trim()) {
            errors.preparationTime = "Preparation time is required.";
        } else if (isNaN(prepTime)) {
            errors.preparationTime = "Preparation time must be a valid number.";
        } else if (prepTime <= 0) {
            errors.preparationTime = "Preparation time must be greater than 0.";
        } else if (prepTime > 30) {
            errors.preparationTime = "Preparation time cannot exceed 30 minutes.";
        }

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
            const inputIngredients = ingredientInput
                .split(",")
                .map(i => i.trim())
                .filter(i => i.length > 0);

            const duplicates = inputIngredients.filter(i =>
                formData.ingredients.includes(i.charAt(0).toUpperCase() + i.slice(1).toLowerCase())
            );

            if (duplicates.length > 0) {
                setFormErrors(prev => ({
                    ...prev,
                    ingredients: "Duplicate ingredients are not allowed",
                }));
                return;
            }

            const newIngredients = inputIngredients
                .map(i => i.charAt(0).toUpperCase() + i.slice(1).toLowerCase());

            setFormData(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, ...newIngredients],
            }));

            setFormErrors(prev => ({ ...prev, ingredients: "" }));
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
        setFormData(prev => {
            const updated = prev.portionPrices.map((portionObj, i) =>
                i === index ? { ...portionObj, [field]: value } : portionObj
            );
            // Remove any portions that are now empty
            const cleaned = updated.filter(p => p.portion.trim() !== "" || p.price.trim() !== "");
            return {
                ...prev,
                portionPrices: cleaned,
            };
        });

        setFormErrors(prev => {
            const updatedErrors = { ...prev };
            delete updatedErrors.portions;
            return updatedErrors;
        });
    };


    const addPortion = (portionObj: { portion: string; price: string }) => {
        if (!portionObj.portion.trim() || !portionObj.price.trim()) return;

        // Validate price is a number and greater than 0
        const priceValue = Number(portionObj.price);
        if (isNaN(priceValue) || priceValue <= 0) {
            setFormErrors(prev => ({
                ...prev,
                portions: "Price must be a valid number greater than 0.",
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            portionPrices: [...prev.portionPrices, portionObj],
        }));

        // Clear error if any
        setFormErrors(prev => {
            const updated = { ...prev };
            delete updated.portions;
            return updated;
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
        setExistingAttachments((prev) => {
            const removed = prev[index];
            const fileName = removed.url.split("/").pop(); // get only the filename
            if (fileName) {
                setRemovedAttachments((prevRemoved) => [...prevRemoved, fileName]);
            }
            return prev.filter((_, i) => i !== index);
        })
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
        if (!isValid) return false;

        const currentAttachmentNames = existingAttachments.map(a => a.url.split("/").pop()); // get only the filename
        const initialAttachmentNames = initialAttachments.map(a => a.url.split("/").pop()); // get only the filename

        const isSameFormData = isEqual(formData, initialFormData);
        const isSameAttachments = isEqual(currentAttachmentNames, initialAttachmentNames);
        const isSameFiles = selectedFiles.length === 0;

        if (isSameFormData && isSameAttachments && isSameFiles) {
            toast("No changes detected.", { icon: "ℹ️" });
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

            const validPortions = formData.portionPrices.filter(p => p.portion.trim() && p.price.trim());
            formPayload.append("portions", JSON.stringify(validPortions.map(p => ({
                portion_title: p.portion,
                portion_price: Number(p.price),
            }))));

            // Attach existing file names (to retain)
            formPayload.append("existing_attachments", JSON.stringify(currentAttachmentNames));

            formPayload.append("removed_attachments", JSON.stringify(removedAttachments));

            // Append new files (images/videos)
            selectedFiles.forEach(file => {
                formPayload.append("files", file);
            });

            await updateFoodItem(id, formPayload);
            toast.success("Food Item Updated Successfully!");
            return true;
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Food Item Update Failed!");
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
        setFormErrors,
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
