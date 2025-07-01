import { getCookie } from '@/constant/cookie';
import { FoodCategory } from '@/interface/foodTypes';

export async function addFoodItem(formData: {
    name: string;
    category: FoodCategory;
    details: string;
    ingredients: string[];
    portionPrices: { portion: string; price: string }[];
    preparationTime: string;
    available: boolean;
    images: File[];
    videos?: File[]; // Optional
}) {
    try {
        const token = getCookie('token');
        if (!token) throw new Error("Unauthorized: No token found");

        const preparationTime = parseInt(formData.preparationTime);

        const form = new FormData();

        form.append('category_id_int', String(formData.category));
        form.append('item_title', formData.name);
        form.append('item_description', formData.details);
        form.append('item_prepartion_time_min', String(preparationTime));
        form.append('is_item_available_for_order', String(formData.available));
        form.append('item_ingredient', JSON.stringify(formData.ingredients));
        const portions = formData.portionPrices.map(({ portion, price }) => ({
            portion_title: portion,
            portion_price: Number(price),
        }));
        form.append("portions", JSON.stringify(portions));

        formData.images.forEach(image => {
            form.append('files', image);
        });
        if (formData.videos) {
            formData.videos.forEach(video => {
                form.append('files', video);
            });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL; // Access from .env

        const response = await fetch(`${baseUrl}/v1/restaurant/add-item`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                // 'Content-Type' should NOT be manually set for FormData
            },
            body: form,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add item.");
        }

        return data;
    } catch (error) {
        console.error("Error adding item:", error);
        throw error;
    }
}


