"use client";

import axios from "axios";
import axiosInstance from "../../utils/services/axiosInstance";

export async function updateFoodItem(id: number, formData: FormData) {
  try {
    const response = await axiosInstance.put(
      `/v1/restaurant/update-item/${id}`,
      formData,
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Error updating food item:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update food item.");
  }
}
