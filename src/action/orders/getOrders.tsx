"use client";
import { getCookie } from "@/constant/cookie"

export async function getOrders() {

  try {
    const token = getCookie('token');
    console.log(token)

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const response = await fetch("https://food-admin.wappzo.com/orders", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json(); 
    console.log("API raw response...:", data);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch orders");
    }
    return Array.isArray(data.data) ? data.data : [];

  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
