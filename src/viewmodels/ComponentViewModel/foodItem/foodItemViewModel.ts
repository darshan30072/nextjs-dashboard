"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FoodItem, RawFoodItem } from "@/models/foodItemModel";
import { getFoodItem, deleteFoodItem, updateAvailability } from "@/services/foodItemService";
import { getCategory } from "@/services/categoriesService";

export function useFoodItemVM() {
    const [foodList, setFoodList] = useState<FoodItem[]>([]);
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const router = useRouter();

    const [confirmToggleId, setConfirmToggleId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [toggleStatus, setToggleStatus] = useState<boolean>(false);
    const [toggleTitle, setToggleTitle] = useState<string>("");
    const [deleteTitle, setDeleteTitle] = useState<string>("");

    const itemsPerPage = 6;

    const fetchData = useCallback(async () => {
        try {
            const { items, pagination } = await getFoodItem(currentPage, itemsPerPage);
            const { categories = [] } = await getCategory();

            const categoryMap = new Map<number, string>();
            categories.forEach((cat: { id_int: number; title: string }) => {
                const id = Number(cat?.id_int);
                if (!isNaN(id)) categoryMap.set(id, cat.title);
            });

            const mappedFood: FoodItem[] = (items as RawFoodItem[]).map((item: RawFoodItem) => {
                const attachment = item.attachments?.[0];
                const fileName = attachment?.file_logical_name || "";
                const isVideo = /\.(mp4|webm|ogg)$/i.test(fileName);
                const fileUrl = attachment
                    ? `https://food-admin.wappzo.com/uploads/items/${fileName}`
                    : "/images/placeholder.jpg";

                return {
                    id: item.id_int,
                    name: item.item_title,
                    category: {
                        id: item.category_id_int,
                        title: categoryMap.get(Number(item.category_id_int)) || "Unknown",
                    },
                    details: item.item_description || "No details provided",
                    ingredients: (() => {
                        try {
                            const parsed = JSON.parse(item.item_ingredient || "[]");
                            if (Array.isArray(parsed)) {
                                return parsed.flatMap((str) => str.split(",").map((s: string) => s.trim()));
                            }
                            return [];
                        } catch {
                            return [];
                        }
                    })(),
                    portionPrices:
                        item.portions?.map((portion) => ({
                            portion: portion?.portion_title ?? "Unnamed Portion",
                            price: portion?.portion_price?.toString() ?? "0",
                        })) || [],
                    preparationTime: item.preparation_time || "00:00",
                    available: item.is_item_available_for_order === 1,
                    image: fileUrl,
                    isVideo,
                    imagePreview:
                        item.attachments?.map(
                            (att) => `https://food-admin.wappzo.com/uploads/items/${att.file_logical_name}`
                        ) || [],
                };
            });

            setFoodList(mappedFood);
            setTotalPages(pagination.totalPages);
        } catch (err) {
            console.error("Error fetching food items:", err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const promptToggle = (id: number, title: string, currentStatus: boolean) => {
        setConfirmToggleId(id);
        setToggleStatus(currentStatus);
        setToggleTitle(title);
    };

    const confirmToggle = async () => {
        if (confirmToggleId == null) return;
        try {
            await updateAvailability(confirmToggleId, !toggleStatus);
            toast.success(`Food item marked as ${!toggleStatus ? "Available" : "Unavailable"}`);
            fetchData();
        } catch (err) {
            toast.error("Failed to update availability");
            console.error(err);
        } finally {
            setConfirmToggleId(null);
        }
    };

    const promptDelete = (id: number, title: string) => {
        setConfirmDeleteId(id);
        setDeleteTitle(title);
    };

    const confirmDelete = async () => {
        if (confirmDeleteId == null) return;
        try {
            await deleteFoodItem(confirmDeleteId);
            toast.success("Item deleted successfully");
            fetchData();
        } catch (err) {
            toast.error("Failed to delete item");
            console.error(err);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    const filteredFoodList = foodList.filter(
        (food) =>
            food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            food.category.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        foodList,
        filteredFoodList,
        selectedFood,
        setSelectedFood,
        isLoading,
        currentPage,
        setCurrentPage,
        totalPages,
        searchTerm,
        setSearchTerm,
        promptToggle,
        confirmToggle,
        confirmToggleId,
        toggleStatus,
        toggleTitle,
        setConfirmToggleId,
        promptDelete,
        confirmDelete,
        confirmDeleteId,
        setConfirmDeleteId,
        deleteTitle,
        router,
    };
}
