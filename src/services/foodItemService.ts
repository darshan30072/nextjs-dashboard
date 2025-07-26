import axiosInstance from "@/utils/services/axiosInstance";
import { FoodCategory } from "@/models/foodItemModel";

export async function getFoodItem(page = 1, limit = 6) {
  try {
    const res = await axiosInstance.get("/v1/restaurant/items", { params: { page, limit } });
    return res.data?.data ?? { items: [], pagination: { totalPages: 1, currentPage: 1 } };
  } catch (error) {
    console.error("Error fetching FoodItems:", error);
    return { items: [], pagination: { totalPages: 1, currentPage: 1 } };
  }
}

export async function getFoodItemById(id: number) {
  const res = await axiosInstance.get(`/v1/restaurant/item/${id}`);
  return res.data;
}

export async function addFoodItem(formData: {
  name: string;
  category: FoodCategory;
  details: string;
  ingredients: string[];
  portionPrices: { portion: string; price: string }[];
  preparationTime: string;
  available: boolean;
  images: File[];
  videos?: File[];
}) {
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
  formData.images.forEach((img) => form.append("files", img));
  formData.videos?.forEach((vid) => form.append("files", vid));

  for (const [key, val] of form.entries()) {
    if (val instanceof File) {
      console.log(`${key} => File:`, val.name, val.type, val.size);
    } else {
      console.log(`${key} =>`, val);
    }
  }

  const res = await axiosInstance.post("/v1/restaurant/add-item", form);
  return res.data;
}

export async function updateFoodItem(id: number, formData: FormData) {
  for (const [key, val] of formData.entries()) {
    if (val instanceof File) {
      console.log(`${key} => FIle:`, val.name, val.type, val.size);
    } else {
      console.log(`${key} =>`, val);
    }
  }
  const res = await axiosInstance.put(`/v1/restaurant/update-item/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateAvailability(id: number, available: boolean) {
  const res = await axiosInstance.put(`/v1/restaurant/${id}/availability`, {
    is_item_available_for_order: available,
  });
  return res.data;
}

export async function deleteFoodItem(id: number) {
  const res = await axiosInstance.delete(`/v1/restaurant/delete-item/${id}`);
  return res.data;
}
