"use client";

import axios from "axios";

export const getFoodItemById = async (id: number) => {
  try {
    const response = await axios.get(`/v1/restaurant/item/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching food item by ID:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch food item.");
  }
};
