'use client';

import { getCookie } from "@/constant/cookie";

export const getFoodItemById = async (id: number) => {
  try {
    const token = getCookie('token');

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

    const response = await fetch(`${baseUrl}/v1/restaurant/item/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
