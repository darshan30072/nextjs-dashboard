"use client";
import { getCookie } from "@/constant/cookie"

export async function getFoodItem(page: number = 1, limit: number = 6) {

  try {
    const token = getCookie('token');
    console.log("Token: ", token);

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

    const response = await fetch(`${baseUrl}/v1/restaurant/items?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Raw API response:", data);

    if (!response.ok || !data?.data?.items) {
      throw new Error("Invalid response format");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching FoodItems:", error);
    return { items: [], pagination: { totalPages: 1, currentPage: 1 } };
  }
}
