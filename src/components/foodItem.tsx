'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Autoplay } from 'swiper/modules';
import { deleteFoodItem } from "@/action/foodItem/deleteFoodItem";
import { getFoodItem } from "@/action/foodItem/getFoodItem";
import { FoodItem, FoodListProps } from "@/interface/foodTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useCategories from "./useCategories";
import { getCategory } from "@/action/category/getCategory";
import FoodItemModal from "./foodItemModal";
import Loader from "./loader";
import MultiSelectDropdown from "./categoriesDropdown";
import toast from "react-hot-toast";
import { updateAvailability } from "@/action/foodItem/updateAvailability";

type RawFoodItem = {
  id_int: number;
  item_title: string;
  category_id_int: number;
  item_description?: string;
  item_ingredient: string;
  ingredients?: string[];
  portions?: {
    portion_title: string;
    portion_name: string;
    portion_price: string;
  }[];
  preparation_time?: string;
  is_item_available_for_order: number;
  attachments?: {
    file_logical_name: string;
  }[];
};

const FoodItemList: React.FC<FoodListProps> = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(true); // <-- loading state


  const filteredList =
    selectedCategories.includes("All")
      ? foodList
      : foodList.filter(food =>
        selectedCategories.includes(food.category.title.toUpperCase())
      );


  const { categories: dynamicCategories } = useCategories();

  const router = useRouter();

  const fetchData = async () => {
    try {
      const data = await getFoodItem();
      const category = await getCategory();
      console.log("Fetched data:", data);

      const categoryMap = new Map<number, string>();
      category.forEach((cat: { id_int: number; title: string; }) => {
        const id = Number(cat?.id_int);
        if (!isNaN(id)) {
          categoryMap.set(id, cat.title);
        } else {
          console.log("Invalid category id:", cat);
        }
      });

      const mappedFood: FoodItem[] = (data as RawFoodItem[]).map((item) => {
        console.log("Raw item:", item);

        const attachment = item.attachments?.[0];
        const fileName = attachment?.file_logical_name || "";
        const isVideo = /\.(mp4|webm|ogg)$/i.test(fileName);
        const fileUrl = attachment
          ? `https://food-admin.wappzo.com/uploads/items/${fileName}`
          : "/placeholder.jpg";

        return {
          id: item.id_int,
          name: item.item_title,
          category: {
            id: item.category_id_int,
            title: categoryMap.get(Number(item.category_id_int)) || "Unknown",
          },
          details: item.item_description || "No details provided",
          ingredients: (() => {
            try {
              const parsed = JSON.parse(item.item_ingredient || "[]");
              // Handle string in array, like ["pav, aloo tikki"]
              if (Array.isArray(parsed)) {
                return parsed.flatMap((str) => str.split(',').map((s: string) => s.trim()));
              }
              return [];
            } catch (e) {
              console.error("Error parsing item_ingredient:", e);
              return [];
            }
          })(),
          portionPrices: item.portions?.map((portion) => ({
            portion: portion?.portion_title ?? "Unnamed Portion",
            price: portion?.portion_price?.toString() ?? "0",
          })) || [],
          preparationTime: item.preparation_time || "00:00",
          available: item.is_item_available_for_order === 1,
          image: fileUrl,
          isVideo,
          imagePreview: item.attachments?.map(att => `https://food-admin.wappzo.com/uploads/items/${att.file_logical_name}`) || [],
        };
      });
      setFoodList(mappedFood);
    } catch (err) {
      console.log("Error fetching data : ", err)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    const shouldDelete = confirm("Are you sure, You want to Delete this food item?");
    if (!shouldDelete) return;
    try {
      await deleteFoodItem(id);
      setFoodList(prev => prev.filter(food => food.id !== id));
      toast.success("Food Item Deleted Successfully!");
      console.log("Deleted Item : ", id)
    }
    catch (err) {
      toast.error("Failed To Delete Food Item");
      console.error("Failed to delete item : ", err);
    }
  };

  const handleToggle = async (id: number) => {
    const foodItem = foodList.find((item) => item.id === id);
    if (!foodItem) return;

    const newAvailability = !foodItem.available;

    try {
      await updateAvailability(id, newAvailability);
      setFoodList(prev =>
        prev.map(item =>
          item.id === id ? { ...item, available: newAvailability } : item
        )
      );
      toast.success(`Marked as ${newAvailability ? "Available" : "Unavailable"}`);
    } catch (err) {
      toast.error("Failed to update availability");
      console.error(err);
    }
  };


  return (
    <div className=" bg-white rounded-xl font-bold border border-gray-200">
      <div className="flex flex-row justify-between items-start sm:items-center p-4 sm:p-6">
        <h1 className="text-xl font-semibold">Food Items</h1>
        <button
          onClick={() => router.push("/foodItem/add")}
          className="bg-orange-500 text-white font-bold px-4 py-2 rounded hover:bg-orange-600 cursor-pointer"
        >
          Add Food Item
        </button>
      </div>

      <div className="min-h-80 rounded-tr-none rounded-tl-none rounded-xl border-t border-gray-300">
        <div className="p-4 sm:p-6">
          <MultiSelectDropdown
            dynamicCategories={dynamicCategories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>

        {/* Loader */}
        {isLoading ? (
          <div className="text-center text-xl py-6 text-gray-500">
            <Loader message="Fetching food items..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-12 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide p-5">
            {filteredList.map(food => (
              <div
                key={food.id}
                className="bg-white shadow hover:shadow-2xl rounded-lg overflow-hidden"
                onClick={() => setSelectedFood(food)}
              >
                <div className="relative h-44 w-full">
                  {/* Main Carousel */}
                  <Swiper
                    spaceBetween={10}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                    modules={[Thumbs, Autoplay]}
                    className="h-40 w-full"
                  >
                    {food.imagePreview.length > 0 ? (
                      food.imagePreview.map((fileUrl, idx) => (
                        <SwiperSlide key={idx}>
                          {/\.(mp4|webm|ogg)$/i.test(fileUrl) ? (
                            <video
                              src={fileUrl}
                              className="w-full h-40 object-cover rounded"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <Image
                              src={fileUrl}
                              alt={`Slide ${idx + 1}`}
                              fill
                              sizes="100"
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </SwiperSlide>
                      ))
                    ) : (
                      <SwiperSlide>
                        <Image
                          src={food.image}
                          alt={food.name}
                          fill
                          sizes="100"
                          className="object-cover"
                          unoptimized
                        />
                      </SwiperSlide>
                    )}
                  </Swiper>
                </div>

                <div className="relative  grid grid-cols-1 gap-3 p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold">{food.name}</h3>
                    <div className="text-orange-500 font-bold text-lg">
                      ${food.portionPrices?.[0]?.price ?? 0}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div
                      className={`flex gap-1 justify-between items-center text-md font-semibold py-1 rounded ${food.available
                        ? "text-green-700"
                        : "text-red-700"
                        }`}
                    >
                      <div className="flex gap-3">
                        <button
                          type="button"
                          role="switch"
                          name="available"
                          aria-checked={food.available}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(food.id);
                          }}
                          className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${food.available ? "bg-green-500" : "bg-red-500"
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${food.available ? "translate-x-6" : "translate-x-1"
                              }`}
                          />
                        </button>

                        <div>
                          {food.available ? "Available" : "Unavailable"}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center text-lg">
                      <button
                        className="text-lg text-orange-500 hover:text-orange-600 cursor-pointer "
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/foodItem/edit/${food.id}`);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-lg text-red-500 hover:text-red-600 cursor-pointer "
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(food.id);
                        }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {selectedFood && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 items-center p-4"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} // Custom 50% black 
              >
                <FoodItemModal
                  item={selectedFood}
                  onClose={() => setSelectedFood(null)}
                />
              </div>
            )}
          </div>
        )}
        {!isLoading && foodList.length > 0 && filteredList.length === 0 && (
          <div className="text-center text-xl py-6 text-gray-500">
            No food items found for selected category.
          </div>
        )}
      </div>
    </div >
  );
};

export default FoodItemList;
