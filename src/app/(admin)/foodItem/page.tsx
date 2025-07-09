"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Autoplay } from "swiper/modules";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import Loader from "@/components/loader";
import { useFoodItemVM } from "@/viewmodels/ComponentViewModel/foodItem/foodItemViewModel";
import useFoodItemModalVM from "@/viewmodels/ComponentViewModel/foodItem/foodItemModalViewModel";
import FoodItemModal from "@/components/foodItem/foodItemModal";
import { useEffect } from "react";

const FoodItemList = () => {
  const {
    filteredFoodList,
    isLoading,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    handleToggle,
    handleDelete,
    setCurrentPage,
  } = useFoodItemVM();

  const router = useRouter();

  // Use modal VM for modal state & handlers
  const {
    item: selectedFood,
    isVisible,
    modalRef,
    closeModal,
    openModal,
    handleEsc,
    handleClickOutside,
  } = useFoodItemModalVM();

  // Add event listeners for ESC and outside click to close modal
  useEffect(() => {
    if (!isVisible) return;

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, handleEsc, handleClickOutside]);

  return (
    <div className="p-4 sm:p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
      <div className="bg-white rounded-xl font-bold mb-5 border border-gray-200 shadow flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6">
          <h1 className="text-lg md:text-xl font-semibold">Food Items</h1>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Search food or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded border font-medium text-sm"
            />
            <button
              onClick={() => router.push("/foodItem/add")}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Add Food Item
            </button>
          </div>
        </div>

        {isLoading ? (
          <Loader message="Fetching food items..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 p-6">
            {filteredFoodList.map((food) => (
              <div
                key={food.id}
                className="bg-white shadow rounded overflow-hidden hover:shadow-2xl cursor-pointer"
                onClick={() => openModal(food)}
              >
                <Swiper autoplay={{ delay: 5000 }} modules={[Thumbs, Autoplay]}>
                  {(food.imagePreview.length > 0 ? food.imagePreview : [food.image]).map((url, i) => {
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
                    return (
                      <SwiperSlide key={i}>
                        {isVideo ? (
                          <video src={url} autoPlay muted loop className="w-full h-40 object-cover" />
                        ) : (
                          <div className="relative w-full h-40">
                            <Image src={url} alt={food.name} fill className="object-cover" unoptimized />
                          </div>
                        )}
                      </SwiperSlide>
                    );
                  })}
                </Swiper>

                <div className="p-4">
                  <div className="flex justify-between text-lg">
                    <h2 className="font-semibold">{food.name}</h2>
                    <span className="text-orange-500 font-bold">₹{food.portionPrices?.[0]?.price ?? 0}</span>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className={`flex items-center gap-2 ${food.available ? "text-green-700" : "text-red-700"}`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(food.id);
                        }}
                        className={`w-11 h-6 rounded-full flex items-center transition duration-300 ${
                          food.available ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 bg-white rounded-full transform transition ${
                            food.available ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span>{food.available ? "Available" : "Unavailable"}</span>
                    </div>

                    <div className="flex gap-2 text-lg">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/foodItem/edit/${food.id}`);
                        }}
                      >
                        <FaEdit className="text-orange-500 hover:text-orange-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(food.id);
                        }}
                      >
                        <MdDelete className="text-red-500 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 hover:bg-gray-200 rounded"
            >
              <GrFormPrevious />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-orange-500 text-white" : "bg-orange-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 hover:bg-gray-200 rounded"
            >
              <GrFormNext />
            </button>
          </div>
        )}

        {/* Render modal only if visible */}
        {isVisible && selectedFood && (
          <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center p-4">
            <FoodItemModal item={selectedFood} onClose={closeModal} ref={modalRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItemList;
