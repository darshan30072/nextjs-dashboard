import { getCookie } from "@/constant/cookie";

// /action/order/deleteOrder.ts
export const deleteOrder = async (id: number): Promise<boolean> => {
    try {

        const token = getCookie('token');
        console.log(token)

        if (!token) {
            throw new Error("Unauthorized: No token found");
        }

        const response = await fetch(`https://food-admin.wappzo.com/orders/${id}`, {
            method: 'DELETE',
            headers: {
                accept: '*/*',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete order");
        }

        const data = await response.json();
        console.log("Delete result:", data);
        return true;
    } catch (error) {
        console.error("Error deleting order:", error);
        return false;
    }
};
