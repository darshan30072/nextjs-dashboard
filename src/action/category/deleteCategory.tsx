"use client";

import { getCookie } from "@/constant/cookie";

export async function deleteCategory(id: number) {
    try {
        const token = getCookie('token');

        if (!token) {
            throw new Error("Unauthorized: No token found");
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

        const response = await fetch(`${baseUrl}/v1/restaurant/delete-category/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete category.");
        }

        return data;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}
