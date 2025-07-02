// // services/categoryService.ts
// import {
//   GetApiData,
//   PostApiData,
//   PutApiData,
//   DeleteApiData,
// } from "./apiService";
// import { CategoryPaginationResponse } from "@/interface/categoryTypes";

// export const addCategory = async (title: string) => {
//   return await PostApiData<{ title: string }, any>(
//     "/v1/restaurant/add-category",
//     { title }
//   );
// };

// export const getCategory = async (
//   page: number = 1,
//   limit: number = 8
// ): Promise<CategoryPaginationResponse> => {
//   try {
//     const data = await GetApiData<any>("/v1/restaurant/categories", {
//       page,
//       limit,
//     });

//     return {
//       categories: Array.isArray(data.data?.categories) ? data.data.categories : [],
//       pagination:
//         data.data?.pagination || {
//           totalItems: 0,
//           totalPages: 1,
//           currentPage: page,
//           itemsPerPage: limit,
//         },
//     };
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return {
//       categories: [],
//       pagination: {
//         totalItems: 0,
//         totalPages: 1,
//         currentPage: page,
//         itemsPerPage: limit,
//       },
//     };
//   }
// };

// export const editCategory = async (id: number, title: string) => {
//   return await PutApiData<{ title: string }, any>(
//     `/v1/restaurant/edit-category/${id}`,
//     { title }
//   );
// };

// export const editAvailability = async (
//   id: number,
//   currentStatus: boolean
// ) => {
//   const data = await PutApiData<{ is_active: boolean }, any>(
//     `/v1/restaurant/toggle-category-status/${id}`,
//     { is_active: !currentStatus }
//   );
//   return data.data;
// };

// export const deleteCategory = async (id: number) => {
//   return await DeleteApiData<any>(
//     `/v1/restaurant/delete-category/${id}`
//   );
// };
