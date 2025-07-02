"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Autoplay } from "swiper/modules";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import FoodItemModal from "./foodItemModal";
import Loader from "../loader";
import { FoodItem, FoodListProps } from "@/interface/foodTypes";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { getCategory } from "@/action/category/getCategory";
import { deleteFoodItem } from "@/action/foodItem/deleteFoodItem";
import { getFoodItem } from "@/action/foodItem/getFoodItem";
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
  // const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(true); // <-- loading state
  // const { categories: dynamicCategories } = useCategories();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const fetchData = useCallback(async () => {
    try {
      const { items, pagination } = await getFoodItem(currentPage, itemsPerPage);
      const { categories = [] } = await getCategory();

      const categoryMap = new Map<number, string>();
      categories.forEach((cat: { id_int: number; title: string; }) => {
        const id = Number(cat?.id_int);
        if (!isNaN(id)) {
          categoryMap.set(id, cat.title);
        } else {
          console.error("Invalid category id:", cat);
        }
      });

      const mappedFood: FoodItem[] = (items as RawFoodItem[]).map((item) => {
        const attachment = item.attachments?.[0];
        const fileName = attachment?.file_logical_name || "";
        const isVideo = /\.(mp4|webm|ogg)$/i.test(fileName);
        const fileUrl = attachment
          ? `https://food-admin.wappzo.com/uploads/items/${fileName}`
          : "/images/placeholder.jpg";
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
      setTotalPages(pagination.totalPages);
    } catch (err) {
      console.error("Error fetching data : ", err)
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteFoodItem(id);
      setFoodList(prev => prev.filter(item => item.id !== id));
      toast.success("Item deleted successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  };

  const handleToggle = async (id: number) => {
    const foodItem = foodList.find(item => item.id === id);
    if (!foodItem) return;

    const newAvailability = !foodItem.available;
    try {
      await updateAvailability(id, newAvailability);
      setFoodList(prev =>
        prev.map(item => item.id === id ? { ...item, available: newAvailability } : item)
      );
      toast.success(`Food Item marked as ${newAvailability ? "Available" : "Unavailable"}`);
    } catch (err) {
      toast.error("Failed to update availability");
      console.error(err);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredFoodList = foodList.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl font-bold mb-5 border border-gray-200 shadow flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6">
        <h1 className="text-lg md:text-xl font-semibold">Food Items</h1>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* <MultiSelectDropdown
          dynamicCategories={[...dynamicCategories].reverse()}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          */}
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
          {filteredFoodList.map(food => (
            <div
              key={food.id}
              className="bg-white shadow rounded overflow-hidden hover:shadow-2xl"
              onClick={() => setSelectedFood(food)}
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
                  <span className="text-orange-500 font-bold">
                    ₹{food.portionPrices?.[0]?.price ?? 0}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className={`flex items-center gap-2 ${food.available ? "text-green-700" : "text-red-700"}`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(food.id);
                      }}
                      className={`w-11 h-6 rounded-full flex items-center transition duration-300 ${food.available ? "bg-green-500" : "bg-red-500"}`}
                    >
                      <span className={`h-4 w-4 bg-white rounded-full transform transition ${food.available ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                    <span>{food.available ? "Available" : "Unavailable"}</span>
                  </div>
                  <div className="flex gap-2 text-lg">
                    <button onClick={(e) => { e.stopPropagation(); router.push(`/foodItem/edit/${food.id}`); }}>
                      <FaEdit className="text-orange-500 hover:text-orange-600" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(food.id); }}>
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
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 hover:bg-gray-200 rounded"
          >
            <GrFormPrevious />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-orange-500 text-white" : "bg-orange-100"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 hover:bg-gray-200 rounded"
          >
            <GrFormNext />
          </button>
        </div>
      )}

      {selectedFood && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 justify-center items-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          {selectedFood && (
            <FoodItemModal item={selectedFood} onClose={() => setSelectedFood(null)} />
          )}
        </div>
      )}
    </div>
  );
};

export default FoodItemList;
