export type FoodCategory = "All" | string;

export type RawFoodItem = {
  id_int: number;
  item_title: string;
  category_id_int: number;
  item_description?: string;
  item_ingredient: string;
  ingredients?: string[];
  portions?: {
    portion_title: string;
    portion_name: string;
    portion_price: string;
  }[];
  preparation_time?: string;
  is_item_available_for_order: number;
  attachments?: {
    file_logical_name: string;
  }[];
};

export interface FoodItem {
  id: number;
  name: string;
  category: {
    id: number;
    title: string;
  };
  details: string;
  ingredients: string[];
  portionPrices: {
    portion: string;
    price: string;
  }[];
  preparationTime: string;
  available: boolean;
  image: string;
  isVideo?: boolean;
  imagePreview: string[];
}

export interface FoodListProps {
  onSelect: (food: FoodItem) => void;
}

export interface FoodItemModalProps {
  item: FoodItem;
  onClose: () => void;
}

export interface FoodItemPaginationResponse {
  items: FoodItem[];
  pagination: {
    totalPages: number;
    currentPage: number;
  };
}
