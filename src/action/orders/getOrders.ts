"use client";

import axios from "axios";
import axiosInstance from "../../utils/services/axiosInstance";

export async function getOrders() {
  try {
    const response = await axiosInstance.get("/v1/restaurant/get-orders");

    const data = response.data;

    if (
      !data?.data?.data?.orders || 
      !Array.isArray(data.data.data.orders)
    ) {
      throw new Error("invalid Response format.");
    }

    return data.data.data.orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch orders.");
  }
}
