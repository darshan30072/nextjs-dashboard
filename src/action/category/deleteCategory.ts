import axios from "axios";
import axiosInstance from "../../utils/services/axiosInstance";

export async function deleteCategory(id: number) {
    try {
        const response = await axiosInstance.delete(`/v1/restaurant/delete-category/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error);

        if (axios.isAxiosError(error)) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
        }

        throw new Error("Failed to delete category.");
    }
}
