"use client";
import { getCookie } from "@/constant/cookie"

export async function getCategory() {

  try {
    const token = getCookie('token');
    console.log(token)

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const response = await fetch("https://food-admin.wappzo.com/api/categories", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch categories");
    }
    return Array.isArray(data.data) ? data.data : [];

  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
