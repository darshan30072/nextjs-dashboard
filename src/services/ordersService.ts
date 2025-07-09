'use client';

import axios from 'axios';
import axiosInstance from '@/utils/services/axiosInstance';

export async function getOrders() {
  try {
    const response = await axiosInstance.get("/v1/restaurant/get-orders");
    const data = response.data;
    if (!data?.data?.data?.orders || !Array.isArray(data.data.data.orders)) {
      throw new Error("Invalid response format.");
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

export async function updateStatusOrders(id: number, status: string) {
  try {
    const response = await axiosInstance.put("/v1/restaurant/update-status", { id, status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update order.");
  }
}

export async function deleteOrder(id: number): Promise<boolean> {
  try {
    await axiosInstance.delete(`/v1/restaurant/order/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to delete order.");
  }
}
