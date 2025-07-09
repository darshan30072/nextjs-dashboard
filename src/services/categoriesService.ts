import { CategoryPaginationResponse } from "@/models/categoriesModel";
import axiosInstance from "@/utils/services/axiosInstance";

export async function getCategory(page = 1, limit = 8): Promise<CategoryPaginationResponse> {
  const res = await axiosInstance.get("/v1/restaurant/categories", {
    params: { page, limit },
  });

  const data = res.data?.data;

  return {
    categories: Array.isArray(data?.categories) ? data.categories : [],
    pagination: data?.pagination || {
      totalItems: 0,
      totalPages: 1,
      currentPage: page,
      itemsPerPage: limit,
    },
  };
}

export async function addCategory(title: string) {
  const res = await axiosInstance.post("/v1/restaurant/add-category", { title });
  return res.data;
}

export async function editCategory(id: number, title: string) {
  const res = await axiosInstance.put(`/v1/restaurant/edit-category/${id}`, { title });
  return res.data;
}

export async function editAvailability(id: number, currentStatus: boolean) {
  const res = await axiosInstance.put(`/v1/restaurant/toggle-category-status/${id}`, {
    is_active: !currentStatus,
  });
  return res.data?.data;
}

export async function deleteCategory(id: number) {
  const res = await axiosInstance.delete(`/v1/restaurant/delete-category/${id}`);
  return res.data;
}
