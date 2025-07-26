"use client";

import Image from "next/image";
import { IoMdAddCircle } from "react-icons/io";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { useCategoriesVM } from "@/viewmodels/MainScreenViewModel/categories/CategoriesViewModal";
import { useAddFoodItemVM } from "@/viewmodels/MainScreenViewModel/foodItem/add/addFoodItemViewModel";
import { useState } from "react";

export default function AddFoodItem() {
  const router = useRouter();
  const { categories: dynamicCats, loading: catsLoading } = useCategoriesVM();

  const [showResetModal, setShowResetModal] = useState(false);

  const commonInputClasses =
    "w-full h-[42px] px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all duration-200";

  // Use your MVVM ViewModel hook here
  const {
    formData,
    formErrors,
    setFormErrors,
    ingredientInput,
    newPortion,
    loading,
    handleChange,
    handleAddIngredient,
    handleRemoveIngredient,
    addPortion,
    handlePortionChange,
    removePortion,
    handleDrop,
    selectedFiles,
    handleRemoveFile,
    toggleAvailable,
    handleSubmit,
    resetForm,
    setIngredientInput,
    setNewPortion,
  } = useAddFoodItemVM();


  return (
    <div>
      <div className="overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto my-5 rounded-xl space-y-6">
          <div className="space-y-4 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
            {loading ? (
              <Loader message="Fetching item data..." />
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mt-3">
                  <h2 className="text-xl font-semibold">Add Food Item</h2>
                  <button
                    type="button"
                    onClick={() => { setShowResetModal(true) }}
                    className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    RESET
                  </button>
                </div>

                <div className="mt-5 mb-8">
                  {/* Category & Item Name */}
                  <div className="flex gap-4 mt-3">
                    {/* Category */}
                    <div className="w-1/2">
                      <label className="font-semibold">
                        CATEGORIES{" "}
                        <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`${commonInputClasses} ${formErrors.category ? "border-red-500" : "border-gray-500"}`}
                        disabled={catsLoading}
                      >
                        <option value="">Select</option>
                        {[...dynamicCats].map(cat => (
                          <option key={cat.id_int} value={cat.id_int.toString()}>
                            {cat.title}
                          </option>
                        ))}
                      </select>
                      <div className="min-h-[15px]">
                        {formErrors.category && (
                          <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.category}</p>
                        )}
                      </div>
                    </div>

                    {/* Item Name */}
                    <div className="w-1/2">
                      <label className="font-semibold">
                        ITEM NAME{" "}
                        <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Item name"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="off"
                        className={`${commonInputClasses} ${formErrors.name ? "border-red-500" : "border-gray-500"}`}
                      />
                      <div className="min-h-[15px]">
                        {formErrors.name && (
                          <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-3">
                    <label className="font-semibold">
                      DESCRIPTION{" "}
                      <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                    </label>
                    <input
                      name="details"
                      placeholder="Item description"
                      value={formData.details}
                      onChange={handleChange}
                      // rows={2}
                      className={`${commonInputClasses} ${formErrors.details ? "border-red-500" : "border-gray-500"}`}
                    />
                    <div className="min-h-[15px]">
                      {formErrors.details && (
                        <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.details}</p>
                      )}
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="mt-3">
                    <label className="font-semibold">
                      INGREDIENTS{" "}
                      <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.ingredients.map(ing => (
                        <span
                          key={ing}
                          className="bg-orange-100 px-3 py-1 mb-2 rounded-xl text-sm flex items-center gap-1"
                        >
                          {ing.charAt(0).toUpperCase() + ing.slice(1)}
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(ing)}
                            className="text-lg font-semibold text-red-500"
                            aria-label={`Remove ingredient ${ing}`}
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
                        onChange={e => setIngredientInput(e.target.value)}
                        className={`${commonInputClasses} border-r-0 rounded-r-none ${formErrors.ingredients ? "border-red-500" : "border-gray-500"}`}
                      />
                      <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="bg-orange-500 text-white px-4 rounded-r border-orange-700 hover:bg-orange-600 cursor-pointer"
                      >
                        ADD
                      </button>
                    </div>
                    <div className="min-h-[15px]">
                      {formErrors.ingredients && (
                        <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.ingredients}</p>
                      )}
                    </div>
                  </div>

                  {/* Portions */}
                  <div className="mt-3">
                    {/* New portion input */}
                    <div className="flex items-end gap-4 pb-0.5">
                      {/* Portion Input */}
                      <div className="w-full">
                        <label className="font-semibold">
                          PORTION{" "}
                          <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Item portion"
                          value={newPortion.portion}
                          onChange={e => setNewPortion({ ...newPortion, portion: e.target.value })}
                          className={`${commonInputClasses} ${formErrors.portions &&
                            formData.portionPrices.filter(p => p.portion.trim() &&
                              p.price.trim()).length === 0 ? "border-red-500" : "border-gray-500"}`}
                        />
                      </div>

                      {/* Price Input */}
                      <div className="w-full">
                        <label className="font-semibold">
                          PRICE{" "}
                          <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                        </label>
                        <div className="relative w-full">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
                          <input
                            type="text"
                            min="0"
                            placeholder="Item price"
                            value={newPortion.price}
                            onChange={e => setNewPortion({ ...newPortion, price: e.target.value })}
                            className={`${commonInputClasses} pl-7 ${formErrors.portions &&
                              formData.portionPrices.filter(p => p.portion.trim() &&
                                p.price.trim()).length === 0 ? "border-red-500" : "border-gray-500"}`}
                          />
                        </div>
                      </div>

                      {/* Add Button */}
                      <div className="flex items-end pb-[6px]">
                        <button
                          type="button"
                          onClick={() => {
                            if (!newPortion.portion.trim() || !newPortion.price.trim()) {
                              setFormErrors(prev => ({
                                ...prev,
                                portions: "Portion and price are required."
                              }));
                              return;
                            }
                            const priceValue = Number(newPortion.price);
                            if (isNaN(priceValue) || priceValue <= 0) {
                              setFormErrors(prev => ({
                                ...prev,
                                portions: "Price must be a valid number greater than 0."
                              }));
                              return;
                            }
                            addPortion(newPortion);
                            setNewPortion({ portion: "", price: "" });
                            setFormErrors(prev => {
                              const updated = { ...prev };
                              delete updated.portions;
                              return updated;
                            });
                          }}
                          aria-label="Add new portion"
                          className="text-orange-500 hover:text-orange-600 transition cursor-pointer"
                        >
                          <IoMdAddCircle size={28} />
                        </button>
                      </div>
                    </div>
                    {/* Render existing portionPrices */}
                    {formData.portionPrices
                      .map((p, idx) => (
                        <div key={idx} className="flex flex-row gap-4 items-end w-full my-2 pb-0.5">
                          <div className="w-full md:w-1/2">
                            <input
                              type="text"
                              name="portion"
                              placeholder="Item portion"
                              value={p.portion}
                              onChange={e => handlePortionChange(idx, "portion", e.target.value)}
                              className={`${commonInputClasses} ${formErrors.portions &&
                                formData.portionPrices.filter(p => p.portion.trim() &&
                                  p.price.trim()).length === 0 ? "border-red-500" : "border-gray-500"}`} />
                          </div>
                          <div className="relative w-full md:w-1/2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
                            <input
                              type="text"
                              name="price"
                              min="0"
                              placeholder="Item price"
                              value={p.price}
                              onChange={e => handlePortionChange(idx, "price", e.target.value)}
                              className={`${commonInputClasses} pl-7 ${formErrors.portions &&
                                formData.portionPrices.filter(p => p.portion.trim() &&
                                  p.price.trim()).length === 0 ? "border-red-500" : "border-gray-500"}`} />
                          </div>
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() => removePortion(idx)}
                              className="text-red-500 cursor-pointer"
                              aria-label="Remove portion"
                            >
                              <IoMdAddCircle size={28} style={{ transform: "rotate(45deg)" }} />
                            </button>
                          </div>
                        </div>
                      ))}
                    <div className="min-h-[15px]">
                      {formErrors.portions && (
                        <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.portions}</p>
                      )}
                    </div>
                  </div>

                  {/* Upload Images/Videos */}
                  <div className="mt-3">
                    <label className="font-semibold" htmlFor="upload-image">UPLOAD PHOTO/VIDEO</label>
                    <div
                      onDrop={handleDrop}
                      onDragOver={e => e.preventDefault()}
                      className="flex gap-4 pt-1 flex-wrap justify-start"
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

                      <div className="flex flex-wrap gap-4">
                        {/* New files (in order) */}
                        {selectedFiles.map((file: File, idx: number) => (
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
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-400 text-white rounded-full w-5 h-5 text-2xl flex justify-center items-center"
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
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-400 text-white rounded-full w-5 h-5 text-2xl flex justify-center items-center"
                              >
                                ×
                              </button>
                            </div>
                          ) : null
                        ))}
                      </div>
                    </div>
                    <div className="min-h-[15px]">
                    </div>
                  </div>

                  {/* Preparation time & Availability */}
                  <div className="flex gap-4 mt-3">
                    {/* Preparation Time */}
                    <div className="w-1/2">
                      <label className="font-semibold">
                        PREPARATION TIME{" "}
                        <span className="text-red-500 text-lg animate-pulse" aria-hidden="true">*</span>
                      </label>
                      <input
                        type="text"
                        name="preparationTime"
                        placeholder="Item preparation time (mins)"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        className={`${commonInputClasses} ${formErrors.preparationTime ? "border-red-500" : "border-gray-500"}`}
                      />
                      <div className="min-h-[15px]">
                        {formErrors.preparationTime && (
                          <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.preparationTime}</p>
                        )}
                      </div>
                    </div>

                    {/* Available toggle */}
                    <div className="w-1/2 pl-3 pt-0.5">
                      <div className="w-full">
                        <label className="font-semibold">AVAILABLE</label>
                        <div className="flex items-center h-[42px]"> {/* Match height to input */}
                          <button
                            type="button"
                            role="switch"
                            name="available"
                            aria-checked={formData.available}
                            onClick={toggleAvailable}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer ${formData.available ? "bg-green-500" : "bg-gray-300"
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 cursor-pointer ${formData.available ? "translate-x-6" : "translate-x-1"
                                }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto px-10 py-2 bg-gray-200 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}
            {showResetModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              >
                <div className="bg-white rounded-xl max-w-md w-full p-6 text-center animate-slideUp">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Reset?</h2>
                  <p className="text-sm text-gray-600 mb-6 font-semibold">Are you sure you want to reset the form? All changes will be lost.</p>
                  <div className="flex justify-center gap-4 font-semibold">
                    <button
                      onClick={() => setShowResetModal(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowResetModal(false);
                      }}
                      className="px-4 py-2 border rounded bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                    >
                      Yes, Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
