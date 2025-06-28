'use client';

import { getCookie } from "@/constant/cookie";

export async function updateFoodItem(id: number, formData: FormData) {
  try {
    const token = getCookie('token');
    console.log("Token : ", token);

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

    const response = await fetch(`${baseUrl}/v1/restaurant/update-item/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        // NOT set 'Content-Type' header explicitly for FormData, browser handles it automatically
      },
      body: formData,
    });

    const data = await response.json();
    console.log("Data : ", data);

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
