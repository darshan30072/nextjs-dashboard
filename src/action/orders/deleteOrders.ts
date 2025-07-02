 import axios from "axios";

// /action/order/deleteOrder.ts
export const deleteOrder = async (id: number): Promise<boolean> => {
    try {
        await axios.delete(`/v1/restaurant/order/${id}`);

        return true;
    } catch (error) {
        console.error("Error deleting order:", error);
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Failed to delete order.");
    }
};
