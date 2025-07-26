"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
import { FiSearch } from "react-icons/fi";

const FoodItemList = () => {
  const {
    filteredFoodList,
    isLoading,
    currentPage,
    totalPages,
    searchTerm,
    promptToggle,
    promptDelete,
    setSearchTerm,
    setCurrentPage,
    confirmToggle,
    confirmToggleId,
    toggleStatus,
    toggleTitle,
    setConfirmToggleId,
    confirmDelete,
    confirmDeleteId,
    setConfirmDeleteId,
    deleteTitle,
  } = useFoodItemVM();

  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const pageParam = Number(searchParams.get("page"));
    if (!isNaN(pageParam) && pageParam >= 1) {
      setCurrentPage(pageParam);
    }
  }, [searchParams, setCurrentPage]);


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
    <div className="h-screen p-4 sm:p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
      <div className="bg-white rounded-xl font-bold mb-5 border border-gray-200 shadow flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6">
          <h1 className="text-lg md:text-xl font-semibold">Food Items</h1>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-24 focus-within:w-96 transition-all duration-300 ease-in-out">
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Food Item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 w-full border border-gray-500 rounded font-medium text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 ease-in-out"
              />
            </div>
            <button
              onClick={() => router.push("/foodItem/add")}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 cursor-pointer"
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
                className="bg-white shadow rounded overflow-hidden hover:shadow-2xl"
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
                          promptToggle(food.id, food.name, food.available);
                        }}
                        className={`cursor-pointer inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${food.available ? "bg-green-500 scale-90" : "bg-red-500 scale-90"}`}
                      >
                        <span className={`h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${food.available ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                      <span>{food.available ? "Available" : "Unavailable"}</span>
                    </div>

                    <div className="flex gap-2 text-lg">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/foodItem/edit/${food.id}?page=${currentPage}`);
                        }}
                      >
                        <FaEdit className="text-orange-500 hover:text-orange-600 cursor-pointer" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          promptDelete(food.id, food.name);
                        }}
                      >
                        <MdDelete className="text-red-500 hover:text-red-600 cursor-pointer" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-1 p-6">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-orange-500 disabled:opacity-50 px-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <GrFormPrevious />
            <span className="text-sm">Previous</span>
          </button>

          {/* Page Numbers with Ellipsis */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              const isStartOrEnd = page === 1 || page === totalPages;
              const isNearCurrent = Math.abs(page - currentPage) <= 1;
              return isStartOrEnd || isNearCurrent;
            })
            .reduce<number[]>((acc, curr, i, arr) => {
              if (i > 0 && curr - arr[i - 1] > 1) acc.push(-1); // insert ellipsis
              acc.push(curr);
              return acc;
            }, [])
            .map((page, index) =>
              page === -1 ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-gray-500 bg-gray-100 rounded"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded cursor-pointer ${currentPage === page
                      ? "bg-orange-500 text-white"
                      : "text-orange-500 hover:bg-gray-200"
                    }`}
                >
                  {page}
                </button>
              )
            )}

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 text-orange-500 disabled:opacity-50 px-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="text-sm">Next</span>
            <GrFormNext />
          </button>
        </div>

        {confirmToggleId !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          >            <div className="bg-white rounded-xl p-6 w-full max-w-md text-center animate-slideUp">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Change Availability?</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to mark <span className="font-bold text-orange-600">{toggleTitle}</span> as{" "}
                <span className={`font-bold ${!toggleStatus ? "text-green-600" : "text-red-600"}`}>
                  {!toggleStatus ? "Available" : "Unavailable"}
                </span>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmToggleId(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmToggle}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmDeleteId !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          >            <div className="bg-white rounded-xl p-6 w-full max-w-md text-center animate-slideUp">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Delete Food Item?</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to permanently delete <span className="font-bold text-red-600">{deleteTitle}</span>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Render modal only if visible */}
        {isVisible && selectedFood && (
          <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center p-4">
            <FoodItemModal item={selectedFood} onClose={closeModal} ref={modalRef} />
          </div>
        )}
      </div>
    </div >
  );
};

export default FoodItemList;
