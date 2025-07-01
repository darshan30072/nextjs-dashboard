import { getCookie } from '@/constant/cookie';

export async function addCategory(title: string) {
    try {
        // Get token from cookies
        const token = getCookie('token');

        if (!token) {
            throw new Error("Unauthorized: No token found");
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

        const response = await fetch(`${baseUrl}/v1/restaurant/add-category`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add category.");
        }
        return data;
    } catch (error) {
        console.error("Error adding category : ", error)
        throw error;
    }
}


