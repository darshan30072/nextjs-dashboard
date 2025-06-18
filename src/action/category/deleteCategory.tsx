"use client";

import { getCookie } from "@/constant/cookie";

export async function deleteCategory(id: number) {
    try {
        const token = getCookie('token');
        console.log(token)

        if (!token) {
            throw new Error("Unauthorized: No token found");
        }

        const response = await fetch(`https://food-admin.wappzo.com/api/delete-category/${id}`, {
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
