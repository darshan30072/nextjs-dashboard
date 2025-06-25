'use client';

import { getCookie } from "@/constant/cookie";

export async function updateAvailability(id: number, is_item_available_for_order: boolean) {
    try {
        const token = getCookie('token');
        console.log("Token : ", token);

        if (!token) {
            throw new Error("Unauthorized: No token found");
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

        const response = await fetch(`${baseUrl}/api/${id}/availability`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ is_item_available_for_order }),
        });

        const data = await response.json();
        console.log("Data : ", data);

        if (!response.ok) {
            console.error("Response not OK", data);
            throw new Error(data.message || "Failed to edit category.");
        }
        return data;
    } catch (err) {
        console.error("Fetch error category : ", err);
        throw err;
    }
};
