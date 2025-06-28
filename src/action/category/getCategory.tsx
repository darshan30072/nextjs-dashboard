"use client";
import { getCookie } from "@/constant/cookie"
import { CategoryPaginationResponse } from "@/interface/categoryTypes";

export async function getCategory(page: number = 1, limit: number = 8): Promise<CategoryPaginationResponse> {

  try {
    const token = getCookie('token');
    console.log("Token : ", token)

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

    const response = await fetch(`${baseUrl}/v1/restaurant/categories?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${ token }`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch categories");
    }

    // Return both categories and pagination info
    return {
      categories: Array.isArray(data.data?.categories) ? data.data.categories : [],
      pagination: data.data?.pagination || {
        totalItems: 0,
        totalPages: 1,
        currentPage: page,
        itemsPerPage: limit,
      },
    };

  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      categories: [],
      pagination: {
        totalItems: 0,
        totalPages: 1,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }
}
