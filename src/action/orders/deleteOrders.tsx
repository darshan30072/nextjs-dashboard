import { getCookie } from "@/constant/cookie";

// /action/order/deleteOrder.ts
export const deleteOrder = async (id: number): Promise<boolean> => {
    try {

        const token = getCookie('token');

        if (!token) {
            throw new Error("Unauthorized: No token found");
        }
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

        const response = await fetch(`${baseUrl}/v1/restaurant/order/${id}`, {
            method: 'DELETE',
            headers: {
                accept: '*/*',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete order");
        }

        await response.json();
        return true;
    } catch (error) {
        console.error("Error deleting order:", error);
        return false;
    }
};
