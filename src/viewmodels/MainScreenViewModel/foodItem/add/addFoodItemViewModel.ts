"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addFoodItem } from "@/services/foodItemService";
import toast from "react-hot-toast";
import { FoodCategory } from "@/models/foodItemModel";

export function useAddFoodItemVM() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category: "" as FoodCategory,
    details: "",
    ingredients: [] as string[],
    portionPrices: [{ portion: "", price: "" }],
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
      const newIngredients = ingredientInput.split(",").map(i => i.trim()).filter(i => i);
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

  const handlePortionChange = (index: number, field: "portion" | "price", value: string) => {
    const updated = [...formData.portionPrices];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, portionPrices: updated }));

    const hasValidPortion = updated.some(p => p.portion.trim() && p.price.trim());

    setFormErrors(prev => {
      const updatedErrors = { ...prev };
      if (hasValidPortion) {
        delete updatedErrors.portions;
      }
      return updatedErrors;
    });
  };

  const addPortion = (portionObj?: { portion: string; price: string }) => {
    setFormData(prev => {
      const cleaned = prev.portionPrices.filter(p => p.portion && p.price);
      const newList = [...cleaned, portionObj || { portion: "", price: "" }];

      const hasValidPortion = newList.some(p => p.portion && p.price);

      if (hasValidPortion) {
        setFormErrors(prev => {
          const updatedErrors = { ...prev };
          delete updatedErrors.portions;
          return updatedErrors;
        });
      }

      return {
        ...prev,
        portionPrices: newList,
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
    if (formData.portionPrices.filter(p => p.portion && p.price).length === 0)
      errors.portions = "Add at least one portion.";
    if (!formData.preparationTime.trim()) errors.preparationTime = "Preparation time required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await addFoodItem({ ...formData, images: selectedFiles });
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
      portionPrices: [{ portion: "", price: "" }],
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
    handlePortionChange,
    addPortion,
    removePortion,
    handleDrop,
    handleRemoveFile,
    toggleAvailable,
    handleSubmit,
    resetForm,
  };
}
