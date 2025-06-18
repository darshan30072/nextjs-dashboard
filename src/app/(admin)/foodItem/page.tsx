'use client';

import FoodItemList from "@/components/foodItem";

export default function MyFoodList() {

  return (
    <div>
      {/* Page Content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide p-4 sm:p-5">
        <div className="rounded-xl ">
          <FoodItemList onSelect={function (): void {
            throw new Error("Function not implemented.");
          }} />
        </div>
      </div>
    </div>
  );
}
