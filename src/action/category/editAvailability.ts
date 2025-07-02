import axios from "axios";
import axiosInstance from "../../utils/services/axiosInstance";

export async function editAvailability(id: number, currentStatus: boolean) {
    try {
        const response = await axiosInstance.put(`/v1/restaurant/toggle-category-status/${id}`, {
            is_active: !currentStatus,
        });
        return response.data.data;
    } catch (error) {
        console.error("Error toggling availability:", error);

        if (axios.isAxiosError(error)) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
        }

        throw new Error("Failed to toggle availability.");
    }
}
