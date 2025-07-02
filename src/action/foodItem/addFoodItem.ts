import axios from "axios";
import { FoodCategory } from "@/interface/foodTypes";
import axiosInstance from "../../utils/services/axiosInstance";

export async function addFoodItem(formData: {
  name: string;
  category: FoodCategory;
  details: string;
  ingredients: string[];
  portionPrices: { portion: string; price: string }[];
  preparationTime: string;
  available: boolean;
  images: File[];
  videos?: File[]; // Optional
}) {
  try {
    const preparationTime = parseInt(formData.preparationTime);

    const form = new FormData();
    form.append("category_id_int", String(formData.category));
    form.append("item_title", formData.name);
    form.append("item_description", formData.details);
    form.append("item_prepartion_time_min", String(preparationTime));
    form.append("is_item_available_for_order", String(formData.available));
    form.append("item_ingredient", JSON.stringify(formData.ingredients));

    const portions = formData.portionPrices.map(({ portion, price }) => ({
      portion_title: portion,
      portion_price: Number(price),
    }));
    form.append("portions", JSON.stringify(portions));

    formData.images.forEach((image) => {
      form.append("files", image);
    });

    if (formData.videos) {
      formData.videos.forEach((video) => {
        form.append("files", video);
      });
    }

    const response = await axiosInstance.post("/v1/restaurant/add-item", form);

    return response.data;
  } catch (error) {
    console.error("Error adding food item:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to add food item.");
  }
}
