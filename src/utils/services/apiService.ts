// services/apiService.ts
import axiosInstance from "@/utils/services/axiosInstance";

export const GetApiData = async <T>(
  url: string,
  params?: Record<string, unknown>
): Promise<T> => {
  const response = await axiosInstance.get<T>(url, { params });
  return response.data;
};

export const PostApiData = async <TBody, TResponse>(
  url: string,
  body: TBody
): Promise<TResponse> => {
  const response = await axiosInstance.post<TResponse>(url, body);
  return response.data;
};

export const PutApiData = async <TBody, TResponse>(
  url: string,
  body: TBody
): Promise<TResponse> => {
  const response = await axiosInstance.put<TResponse>(url, body);
  return response.data;
};

export const DeleteApiData = async <T>(
  url: string
): Promise<T> => {
  const response = await axiosInstance.delete<T>(url);
  return response.data;
};
