"use client";

import axios from "axios";
import axiosInstance from "../../utils/services/axiosInstance";

export async function updateAvailability(id: number, is_item_available_for_order: boolean) {
    try {
        const response = await axiosInstance.put(
            `/v1/restaurant/${id}/availability`,
            { is_item_available_for_order },
        );

        return response.data;
    } catch (error) {
        console.error("Error updating availability:", error);
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Failed to update availability.");
    }
}
