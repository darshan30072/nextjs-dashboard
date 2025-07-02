"use client";

import axios from "axios";
import axiosInstance from "../../utils/services/axiosInstance";

export async function editCategory(id: number, title: string) {
  try {
    const response = await axiosInstance.put(
      `/v1/restaurant/edit-category/${id}`,
      { title }
    );

    return response.data;
  } catch (error) {
    console.error("Error editing category:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }

    throw new Error("Failed to edit category.");
  }
}
