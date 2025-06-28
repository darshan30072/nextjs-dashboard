"use client";

import { getCookie } from "@/constant/cookie";

export async function editAvailability(id: number, currentStatus: boolean) {
    try {
        const token = getCookie("token");

        if (!token) {
            throw new Error("Unauthorized: No token found");
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

        const response = await fetch(`${baseUrl}/v1/restaurant/toggle-category-status/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                is_active: !currentStatus,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to toggle availability.");
        }

        return data.data; // returning updated category
    } catch (err) {
        console.error("Availability toggle error:", err);
        throw err;
    }
}
