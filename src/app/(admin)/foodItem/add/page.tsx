'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FoodCategory } from "@/interface/foodTypes";
import { addFoodItem } from "@/action/foodItem/addFoodItem";
import Image from "next/image";
import { IoMdAddCircle } from "react-icons/io";
import useCategories from "@/components/foodItem/useCategories";
import Loader from "@/components/loader";
import toast from "react-hot-toast";

type PortionPrice = {
  portion: string;
  price: string;
};

export default function AddFoodItem() {
  const router = useRouter();
  const { categories: dynamicCats, loading: catsLoading } = useCategories();

  const [ingredientInput, setIngredientInput] = useState("");
  const [newPortion, setNewPortion] = useState<PortionPrice>({ portion: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, type } = target;

    // Clear the specific field's error
    setFormErrors(prev => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });

    if (target instanceof HTMLInputElement && type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else if (target instanceof HTMLInputElement && type === "file" && target.files) {
      const files = Array.from(target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    } else {
      setFormData(prev => ({ ...prev, [name]: target.value }));
    }
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      const newIngredients = ingredientInput
        .split(", ")
        .map(i => i.trim())
        .filter(i => i.length > 0);
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ...newIngredients],
      }));
      setIngredientInput("");

      // Clear error for ingredients
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

    // Clear portions error
    setFormErrors(prev => {
      const updatedErrors = { ...prev };
      delete updatedErrors.portions;
      return updatedErrors;
    });
  };


  const addPortion = (portionObj?: { portion: string; price: string }) => {
    setFormData(prev => {
      const cleanedPortions = prev.portionPrices.filter(
        (p) => p.portion.trim() !== "" && p.price.trim() !== ""
      );
      return {
        ...prev,
        portionPrices: [...cleanedPortions, portionObj || { portion: "", price: "" }],
      };
    });
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

  // Drag and drop handler (optional)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Remove file (image or video) by index
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Item name is required.";
    if (!formData.category.trim()) errors.category = "Category is required.";
    if (!formData.details.trim()) errors.details = "Description is required.";
    if (formData.ingredients.length === 0) errors.ingredients = "At least one ingredient is required.";
    const validPortions = formData.portionPrices.filter(p => p.portion.trim() && p.price.trim());
    if (validPortions.length === 0) errors.portions = "At least one valid portion and price is required.";
    if (!formData.preparationTime) errors.preparationTime = "Preparation time is required.";

    // If errors exist, prevent submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the form errors.");
      return;
    }

    setFormErrors({});
    setLoading(true);

    try {
      // Attach files to formData as needed for your backend
      await addFoodItem({
        ...formData,
        images: selectedFiles, // Pass all files in order
      });
      toast.success("Food Item Added Successfully!");
      router.push("/foodItem");
    } catch (err) {
      toast.error("Food Item Add Failed!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Content */}
      <div className="overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto my-5 rounded-xl space-y-6">
          <div className="space-y-4 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
            {loading ? (
              <Loader message="Fetching item data..." />
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mt-1 mb-5">
                  <h2 className="text-xl font-semibold">Add Food Item</h2>

                  <button type="button"
                    onClick={resetForm}
                    className={"text-sm text-gray-400 hover:text-gray-600 cursor-pointer"}
                  >
                    RESET
                  </button>
                </div>
                <div className="mt-4">
                  <label className="font-semibold">
                    CATEGORIES <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border mt-1 p-2 rounded"
                    disabled={catsLoading}
                  >
                    <option value="">Select</option>
                    {[...dynamicCats].reverse().map(cat => (
                      <option key={cat.id_int} value={cat.id_int.toString()} className="mt-1">
                        {cat.title}
                      </option>
                    ))
                    }
                  </select>
                  {formErrors.category && <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.category}</p>}
                </div>

                <div className="mt-4">
                  <label className="font-semibold">
                    ITEM NAME <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Item name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border mt-1 p-2 rounded"
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.name}</p>}
                </div>

                <div className="mt-4">
                  <label className="font-semibold">
                    DESCRIPTION <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    name="details"
                    placeholder="Item description"
                    value={formData.details}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border mt-1 p-2 rounded"
                  />
                  {formErrors.details && <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.details}</p>}
                </div>

                <div className="mt-4">
                  <label className="font-semibold">
                    INGREDIENTS <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.ingredients.map(ing => (
                      <span key={ing} className="bg-orange-100 px-3 py-1 mb-2 rounded-xl text-sm">
                        {ing.charAt(0).toUpperCase() + ing.slice(1)}
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(ing)}
                          className="ml-1 text-lg font-semibold text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Item ingredient"
                      value={ingredientInput}
                      onChange={(e) => setIngredientInput(e.target.value)}
                      className="border p-2 rounded-l w-full"
                    />
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="bg-orange-500 text-white px-4 rounded-r hover:bg-orange-600"
                    >
                      ADD
                    </button>
                  </div>
                  {formErrors.ingredients && <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.ingredients}</p>}
                </div>

                {/* PORTIONS */}
                <div className="mt-4">
                  <div className="grid grid-cols-2">
                    <label className="font-semibold ">
                      PORTIONS <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                    </label>
                  </div>
                  {/* Only display portions that are not empty */}
                  {formData.portionPrices
                    .filter(p => p.portion.trim() !== "" && p.price.trim() !== "")
                    .map((p, idx) => (
                      <div key={idx} className="flex flex-row gap-4 items-end w-full mt-1 my-3">
                        <div className="w-full md:w-1/2">
                          <input
                            type="text"
                            name="portion"
                            placeholder="Item portion"
                            value={p.portion}
                            onChange={e => handlePortionChange(idx, "portion", e.target.value)}
                            className="w-full border p-2 rounded mt-1"
                          />
                        </div>
                        <div className="w-full md:w-1/2">
                          <input
                            type="number"
                            name="price"
                            min="0"
                            placeholder="Item price"
                            value={p.price}
                            onChange={e => handlePortionChange(idx, "price", e.target.value)}
                            className="w-full border p-2 rounded mt-1"
                          />
                        </div>
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => removePortion(idx)}
                            className="text-red-500"
                            aria-label="Remove portion"
                          >
                            <IoMdAddCircle size={28} style={{ transform: "rotate(45deg)" }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  {/* Input for adding a new portion */}
                  <div className="flex flex-row gap-4 items-end w-full">
                    <div className="w-full md:w-1/2">
                      <input
                        type="text"
                        placeholder="Item portion"
                        value={newPortion.portion}
                        onChange={e => setNewPortion({ ...newPortion, portion: e.target.value })}
                        className="w-full border p-2 rounded mt-1"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Item price"
                        value={newPortion.price}
                        onChange={e => setNewPortion({ ...newPortion, price: e.target.value })}
                        className="w-full border p-2 rounded mt-1"
                      />
                    </div>
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (newPortion.portion && newPortion.price) {
                            addPortion(newPortion);
                            setNewPortion({ portion: "", price: "" });
                          }
                        }}
                        aria-label="Add new portion"
                        className="text-orange-500"
                      >
                        <IoMdAddCircle size={28} />
                      </button>
                    </div>
                  </div>
                  {formErrors.portions && <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.portions}</p>}
                </div>

                <div className="mt-4">
                  <label className="font-semibold" htmlFor="upload-image">UPLOAD PHOTO/VIDEO</label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    className="flex gap-4 mt-2 flex-wrap justify-start"
                  >
                    <label
                      className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition"
                    >
                      <input
                        id="upload-image"
                        type="file"
                        name="images"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center text-gray-400">
                        <div className="bg-orange-100 rounded-full px-3 py-1">
                          <span className="text-orange-500 text-xl font-bold">+</span>
                        </div>
                        <span className="text-sm font-medium">Add</span>
                      </div>
                    </label>

                    <div className="flex flex-wrap gap-4 mt-3">
                      {selectedFiles.map((file, idx) =>
                        file.type.startsWith("image/") ? (
                          <div key={idx} className="relative w-28 h-28">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              fill
                              className="rounded object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="absolute top-1 right-1 bg-black/100 hover:bg-red-600 text-white rounded-full w-5 h-5 text-xs flex justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ) : file.type.startsWith("video/") ? (
                          <div key={idx} className="relative w-28 h-28">
                            <video
                              src={URL.createObjectURL(file)}
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="rounded object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="absolute top-1 right-1  bg-black/100 hover:bg-red-600 text-white rounded-full w-5 h-5 text-xs flex justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="font-semibold">
                    PREPARATION TIME <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    placeholder="Item preparation time"
                    max="30"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    className="w-full border mt-1 p-2 rounded"
                  />
                  {formErrors.preparationTime && <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.preparationTime}</p>}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <label className="font-semibold">Available</label>
                  <button
                    type="button"
                    role="switch"
                    name="available"
                    aria-checked={formData.available}
                    onClick={() =>
                      setFormData(prev => ({ ...prev, available: !prev.available }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${formData.available ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${formData.available ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-5">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



