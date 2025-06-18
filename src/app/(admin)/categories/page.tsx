"use client";

import CategoriesList from "@/components/categoriesList";

export default function Categories() {

  return (
    <div>
      {/* Categories List */}
      <div className="p-4 sm:p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
        <CategoriesList />
      </div>
    </div>
  );
}
