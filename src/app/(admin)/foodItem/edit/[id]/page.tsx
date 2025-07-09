'use client';

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { IoMdAddCircle } from "react-icons/io";
import Loader from "@/components/loader";
import { useCategoriesVM } from "@/viewmodels/MainScreenViewModel/categories/CategoriesViewModal";
import { useEditFoodItemVM } from "@/viewmodels/MainScreenViewModel/foodItem/edit/editFoodItemViewModel";

export default function EditFoodItem() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { categories: dynamicCats, loading: catsLoading } = useCategoriesVM();

  const {
    loading,
    formData,
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
    existingAttachments,
    handleDrop,
    handleRemoveFile,
    handleRemoveExisting,
    toggleAvailable,
    resetForm,
    handleSubmit,
  } = useEditFoodItemVM(id);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(id);
    if (success) {
      router.push("/foodItem");
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
              <form onSubmit={onSubmit}>
                <div className="flex justify-between items-center mt-1 mb-5">
                  <h2 className="text-xl font-semibold">Edit Food Item</h2>
                  <button type="button"
                    onClick={resetForm}
                    className={"text-sm text-gray-400 hover:text-gray-600 cursor-pointer"}
                  >
                    RESET
                  </button>
                </div>
                <div className="mt-4">
                  <label className="font-semibold">
                    CATEGORIES <span className="text-red-500 animate-pulse text-lg" aria-hidden="true">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full border mt-1 p-2 rounded ${formErrors.category ? "border-red-500" : "border-gray-500"}`}
                    disabled={catsLoading}
                  >
                    <option value="">Select</option>
                    {dynamicCats.length > 0 &&
                      [...dynamicCats].map(cat => (
                        <option key={cat.id_int} value={cat.id_int.toString()} className="mt-1">
                          {cat.title}
                        </option>
                      ))
                    }
                  </select>
                  {formErrors.category && (
                    <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.category}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="font-semibold">
                    ITEM NAME <span className="text-red-500 animate-pulse text-lg" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Item name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border mt-1 p-2 rounded ${formErrors.name ? "border-red-500" : "border-gray-500"}`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.name}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="font-semibold">
                    DESCRIPTION <span className="text-red-500 animate-pulse text-lg" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    name="details"
                    placeholder="Item description"
                    value={formData.details}
                    onChange={handleChange}
                    rows={2}
                    className={`w-full border mt-1 p-2 rounded ${formErrors.details ? "border-red-500" : "border-gray-500"}`}
                  />
                  {formErrors.details && (
                    <p className="text-red-500 text-sm font-semibold">{formErrors.details}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="font-semibold">
                    INGREDIENTS <span className="text-red-500 animate-pulse text-lg" aria-hidden="true">*</span>
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
                      className={`w-full border border-r-0 p-2 rounded rounded-r-none ${formErrors.ingredients && formData.ingredients.length === 0
                        ? "border-red-500"
                        : "border-gray-500"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="bg-orange-500 text-white px-4 rounded-r hover:bg-orange-600"
                    >
                      ADD
                    </button>
                  </div>
                  {formErrors.ingredients && formData.ingredients.length === 0 && (
                    <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.ingredients}</p>
                  )}
                </div>

                <div className="mt-4">
                  <div className="grid grid-cols-2">
                    <label className="font-semibold ">
                      PORTIONS <span className="text-red-500 animate-pulse text-lg" aria-hidden="true">*</span>
                    </label>
                  </div>
                  {/* Render existing portionPrices */}
                  {formData.portionPrices.map((p, idx) => (
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
                        {/* Only show remove if more than portion */}
                        {formData.portionPrices.length > 1 || (p.portion || p.price) ? (
                          <button
                            type="button"
                            onClick={() => removePortion(idx)}
                            className="text-red-500"
                            aria-label="Remove portion"
                          >
                            <IoMdAddCircle size={28} style={{ transform: "rotate(45deg)" }} />
                          </button>
                        ) : null}
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
                        className={`w-full border p-2 rounded mt-1 ${formErrors.portions && formData.portionPrices.filter(p => p.portion.trim() && p.price.trim()).length === 0
                            ? "border-red-500"
                            : "border-gray-500"
                          }`}
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Item price"
                        value={newPortion.price}
                        onChange={e => setNewPortion({ ...newPortion, price: e.target.value })}
                        className={`w-full border p-2 rounded mt-1 ${formErrors.portions && formData.portionPrices.filter(p => p.portion.trim() && p.price.trim()).length === 0
                            ? "border-red-500"
                            : "border-gray-500"
                          }`}
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
                  {formErrors.portions && formData.portionPrices.length === 0 && (
                    <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.portions}</p>
                  )}
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

                    <div className="flex flex-wrap gap-4">
                      {/* Existing attachments (from DB) */}
                      {existingAttachments.map((att, idx) =>
                        att.type === "image" ? (
                          <div key={`existing-img-${idx}`} className="relative w-28 h-28">
                            <Image src={att.url} alt="existing" fill className="rounded object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveExisting(idx)}
                              className="absolute top-1 right-1 bg-black/100 hover:bg-red-600 text-white rounded-full w-5 h-5 text-xs flex justify-center pt-0.5"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div key={`existing-vid-${idx}`} className="relative w-28 h-28">
                            <video src={att.url} autoPlay muted loop playsInline className="rounded object-cover w-full h-full" />
                            <button
                              type="button"
                              onClick={() => handleRemoveExisting(idx)}
                              className="absolute top-1 right-1 bg-black/100 hover:bg-red-600 text-white rounded-full w-5 h-5 text-xs flex justify-center pt-0.5"
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                      {/* New files (in order) */}
                      {selectedFiles.map((file, idx) =>
                        file.type.startsWith("image/") ? (
                          <div key={`new-img-${idx}`} className="relative w-28 h-28">
                            <Image src={URL.createObjectURL(file)} alt="preview" fill className="rounded object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="absolute top-1 right-1 bg-black/100 hover:bg-red-600 text-white rounded-full w-5 h-5 text-xs flex justify-center pt-0.5"
                            >
                              ×
                            </button>
                          </div>
                        ) : file.type.startsWith("video/") ? (
                          <div key={`new-vid-${idx}`} className="relative w-28 h-28">
                            <video src={URL.createObjectURL(file)} autoPlay muted loop playsInline className="rounded object-cover w-full h-full" />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="absolute top-1 right-1 bg-black/100 hover:bg-red-600 text-white rounded-full w-5 h-5 text-xs flex justify-center pt-0.5"
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
                    PREPARATION TIME <span className="text-red-500 animate-pulse text-lg" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    placeholder="Item preparation time"
                    max="30"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    className={`w-full border mt-1 p-2 rounded ${formErrors.preparationTime ? "border-red-500" : "border-gray-500"}`}
                  />
                  {formErrors.preparationTime && (
                    <p className="text-red-500 text-sm mt-1 font-semibold">{formErrors.preparationTime}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <label className="font-semibold">Available</label>
                  <button
                    type="button"
                    role="switch"
                    name="available"
                    aria-checked={formData.available}
                    onClick={toggleAvailable}
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
                    // onClick={onSubmit}
                    className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Update Item
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
