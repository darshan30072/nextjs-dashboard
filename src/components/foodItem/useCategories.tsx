import { getCategory } from "@/action/category/getCategory";
import { useEffect, useState } from "react";

export interface Category {
  id: number;
  id_int: number;
  title: string;
}

export default function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    try {
      const data = await getCategory();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return { categories, loading };
}
