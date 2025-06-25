"use client";
import { getCookie } from "@/constant/cookie"

export async function getFoodItem() {

  try {
    const token = getCookie('token');
    console.log("Token: ", token);

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

    const response = await fetch(`${baseUrl}/api/items`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !Array.isArray(data)) {
      throw new Error("Invalid response format");
    }

    return data;
  } catch (error) {
    console.error("Error fetching FoodItems:", error);
    return [];
  }
}
