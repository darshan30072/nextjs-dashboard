"use client";

import axios from "axios";
import axiosInstance from "../../utils/services/axiosInstance";

export async function getOrders() {
  try {
    const response = await axiosInstance.get("/v1/restaurant/get-orders");

    const data = response.data;

    if (!Array.isArray(data.data)) {
      throw new Error("Invalid response format");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch orders.");
  }
}
