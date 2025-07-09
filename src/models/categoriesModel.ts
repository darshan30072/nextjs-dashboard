export interface Category {
  id: number;
  id_int: number;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryPaginationResponse {
  categories: Category[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}
