// apiClient.ts
"use client";

import { getCookie } from "@/constant/cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://food-admin.wappzo.com/api/";

export async function apiClient<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: string
): Promise<T> {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || `API ${method} request failed`);
    }

    return data;
  } catch (error) {
    console.error(`API ${method} error:`, error);
    throw error;
  }
}
