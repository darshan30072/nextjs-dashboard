"use client";

import axios from "axios";
import axiosInstance from "../../utils/services/axiosInstance";

export async function updateStatusOrders(id: number, status: string) {
    try {
        const response = await axiosInstance.put(
            "/v1/restaurant/update-status",
            { id, status }, // assuming id is also required in body (since it was passed to the function)
        );

        return response.data;
    } catch (error) {
        console.error("Error updating order:", error);
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Failed to update order.");
    }
}
