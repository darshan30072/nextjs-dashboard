import axios from "axios";
import axiosInstance from "../../utils/services/axiosInstance";

export async function addCategory(title: string) {
  try {
    const response = await axiosInstance.post("/v1/restaurant/add-category", { title });
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }

    throw new Error("Failed to add category.");
  }
}
