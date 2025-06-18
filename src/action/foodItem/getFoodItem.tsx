"use client";
import { getCookie } from "@/constant/cookie"

export async function getFoodItem() {

  try {
    const token = getCookie('token');
    console.log("Token: ",token);

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const response = await fetch("https://food-admin.wappzo.com/api/items", {
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
