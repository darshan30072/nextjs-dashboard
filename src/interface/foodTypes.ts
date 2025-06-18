export type FoodCategory = "All" | string;

export interface FoodListProps {
  onSelect: (food: FoodItem) => void;
}

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
  isVideo?: boolean; // NEW FIELD
  imagePreview: string  [],
}