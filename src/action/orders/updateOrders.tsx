"use client";

import { getCookie } from "@/constant/cookie";

export async function updateStatusOrders(id: number, status: string) {
    try {
        const token = getCookie('token');
        console.log("Token : ", token);

        if (!token) {
            throw new Error("Unauthorized: No token found");
        }

        const response = await fetch("https://food-admin.wappzo.com/orders/update-status", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        const data = await response.json();

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


