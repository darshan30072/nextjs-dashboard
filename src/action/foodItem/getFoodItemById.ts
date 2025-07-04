"use client";

import axiosInstance from "@/utils/services/axiosInstance";
import axios from "axios";

export const getFoodItemById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/v1/restaurant/item/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching food item by ID:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch food item.");
  }
};
