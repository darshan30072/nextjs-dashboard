"use client";

import { FoodItem } from "@/models/foodItemModel";
import { useCallback, useRef, useState } from "react";

export default function useFoodItemModalVM() {
  const [item, setItem] = useState<FoodItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = (food: FoodItem) => {
    setItem(food);
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setItem(null), 300); 
  };

  const allMedia = item?.imagePreview?.length
    ? item.imagePreview
    : item?.image
    ? [item.image]
    : [];

  const handleEsc = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") closeModal();
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  }, []);

  return {
    modalRef,
    isVisible,
    item,
    allMedia,
    closeModal,
    handleEsc,
    handleClickOutside,
    openModal, // <-- expose to use from parent to show modal
  };
}
