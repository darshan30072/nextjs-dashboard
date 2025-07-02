"use client";
import { CategoryPaginationResponse } from "@/interface/categoryTypes";
import axiosInstance from "../../utils/services/axiosInstance";

export async function getCategory(
  page: number = 1,
  limit: number = 8
): Promise<CategoryPaginationResponse> {
  try {
    const response = await axiosInstance.get("/v1/restaurant/categories", {
      params: {
        page,
        limit,
      },
    });

    const data = response.data;

    return {
      categories: Array.isArray(data.data?.categories) ? data.data.categories : [],
      pagination:
        data.data?.pagination || {
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
