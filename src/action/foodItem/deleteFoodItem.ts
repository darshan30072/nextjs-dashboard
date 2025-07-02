"use client";

import axios from "axios";
import axiosInstance from "../../utils/services/axiosInstance";

export async function deleteFoodItem(id: number) {
  try {
    const response = await axiosInstance.delete(`/v1/restaurant/delete-item/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error deleting food item:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to delete food item.");
  }
}
