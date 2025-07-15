"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addFoodItem } from "@/services/foodItemService";
import toast from "react-hot-toast";
import { FoodCategory, FormData } from "@/models/foodItemModel";

export function useAddFoodItemVM() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "" as FoodCategory,
    details: "",
    ingredients: [] as string[],
    portionPrices: [],
    preparationTime: "",
    available: false,
    images: [] as File[],
    videos: [] as File[],
    imagePreviews: [] as string[],
    videoPreviews: [] as string[],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [newPortion, setNewPortion] = useState({ portion: "", price: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, type } = target;

    setFormErrors(prev => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });

    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (target as HTMLInputElement).checked }));
    } else if (type === "file" && target instanceof HTMLInputElement && target.files) {
      const files = Array.from(target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    } else {
      setFormData(prev => ({ ...prev, [name]: target.value }));
    }
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      const newIngredients = ingredientInput.split(",").map(i => i.trim()).filter(i => i).map(i => i.charAt(0).toUpperCase() + i.slice(1).toLowerCase());
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ...newIngredients],
      }));
      setIngredientInput("");

      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated.ingredients;
        return updated;
      });
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(item => item !== ingredient),
    }));
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

  const toggleAvailable = () => {
    setFormData(prev => ({ ...prev, available: !prev.available }));
    setFormErrors(prev => {
      const updated = { ...prev };
      delete updated.available;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Item name is required.";
    if (!formData.category) errors.category = "Category is required.";
    if (!formData.details.trim()) errors.details = "Description is required.";
    if (formData.ingredients.length === 0) errors.ingredients = "Add at least one ingredient.";

    // Portion price validation
    const validPortions = formData.portionPrices.filter(p => {
      if (!p.portion.trim() || !p.price.trim()) return false;
      const priceValue = Number(p.price);
      return !isNaN(priceValue) && priceValue > 0;
    });

    if (validPortions.length === 0) {
      errors.portions = "At least one valid portion with a numeric price greater than 0 is required.";
    } else {
      // Optionally, check for any invalid portions and give a more specific error
      const hasInvalid = formData.portionPrices.some(p => {
        if (!p.portion.trim() || !p.price.trim()) return false;
        const priceValue = Number(p.price);
        return isNaN(priceValue) || priceValue <= 0;
      });
      if (hasInvalid) {
        errors.portions = "Each portion price must be a valid number greater than 0.";
      }
    }

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

    // If errors exist, prevent submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setLoading(true);

    try {
      await addFoodItem({
        ...formData,
        portionPrices: validPortions, // Only send valid portions!
        images: selectedFiles,
      });
      toast.success("Food Item Added Successfully!");
      router.push("/foodItem");
    } catch (err) {
      toast.error("Failed to add food item");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      images: [],
      videos: [],
      imagePreviews: [],
      videoPreviews: [],
    });
    setIngredientInput("");
    setSelectedFiles([]);
    setNewPortion({ portion: "", price: "" });
  };

  return {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    selectedFiles,
    ingredientInput,
    setIngredientInput,
    newPortion,
    setNewPortion,
    loading,
    handleChange,
    handleAddIngredient,
    handleRemoveIngredient,
    addPortion,
    handlePortionChange,
    removePortion,
    handleDrop,
    handleRemoveFile,
    toggleAvailable,
    handleSubmit,
    resetForm,
  };
}
