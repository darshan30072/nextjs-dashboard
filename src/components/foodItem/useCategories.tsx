import { getCategory } from "@/action/category/getCategory";
import { Category } from "@/interface/categoryTypes";
import { useEffect, useState } from "react";


export default function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    try {
      const data = await getCategory();
      setCategories(data.categories);
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
