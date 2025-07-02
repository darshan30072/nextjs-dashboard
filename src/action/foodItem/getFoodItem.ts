"use client";
import axiosInstance from "../../utils/services/axiosInstance";

export async function getFoodItem(page: number = 1, limit: number = 6) {
  try {
    const response = await axiosInstance.get("/v1/restaurant/items", {
      params: {
        page,
        limit,
      },
    });

    const data = response.data;

    if (!data?.data?.items) {
      throw new Error("Invalid response format");
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching FoodItems:", error);

    return {
      items: [],
      pagination: {
        totalPages: 1,
        currentPage: 1,
      },
    };
  }
}
