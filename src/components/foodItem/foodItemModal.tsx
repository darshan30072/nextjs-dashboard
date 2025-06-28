"use client";

import React, { useEffect, useRef, useState } from "react";
import { FoodItem } from "@/interface/foodTypes";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Autoplay, Pagination, Navigation } from "swiper/modules";
import { IoClose } from "react-icons/io5";

interface FoodItemModalProps {
  item: FoodItem;
  onClose: () => void;
}

const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

const FoodItemModal: React.FC<FoodItemModalProps> = ({ item, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const allMedia = item.imagePreview?.length ? item.imagePreview : [item.image];

  // Trigger enter animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // duration matches Tailwind transition
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center p-4 bg-opacity-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-xl max-w-3xl w-full p-10 relative
                    transform transition-all duration-300
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <button
          onClick={closeModal}
          className="absolute top-2.5 right-3.5 font-extrabold text-gray-700 hover:text-black hover:border-2 hover:border-gray-500 rounded-full text-2xl"
        >
          <IoClose />
        </button>

        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-3">
          <Swiper
            spaceBetween={10}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Thumbs, Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            className="h-full w-full"
          >
            {allMedia.map((url, idx) => (
              <SwiperSlide key={idx}>
                {isVideo(url) ? (
                  <video
                    src={url}
                    className="w-full h-64 object-cover rounded-lg"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <Image
                    src={url}
                    alt={`Food ${idx}`}
                    fill
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                )}
                <div className="absolute bottom-0 left-5 bg-white text-sm text-gray-900 font-semibold rounded-md px-4 py-1 mb-2">
                  {item.category.title}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex justify-between items-start my-3">
          <h3 className="text-xl font-bold">{item.name}</h3>
          <div className="text-orange-500 text-lg">
            ₹{item.portionPrices?.[0]?.price ?? 0}
          </div>
        </div>

        <hr className="border border-gray-300" />

        <div className="flex gap-3 my-3">
          <div className="flex justify-between font-bold w-1/5">
            Description
            <div className="pl-3.5">:</div>
          </div>
          <div className="text-sm text-gray-700 font-semibold whitespace-pre-line w-4/5 break-words">
            {item.details}
          </div>
        </div>

        <div className="flex gap-3 my-3">
          <div className="flex justify-between font-bold w-1/5">
            Ingredients
            <div>:</div>
          </div>
          <div className="text-sm text-gray-700 font-semibold">
            {item.ingredients
              .map(ing => ing.charAt(0).toUpperCase() + ing.slice(1))
              .join(", ")}
          </div>
        </div>

        <div className="flex gap-3 my-3">
          <div className="flex justify-between font-bold w-1/5">
            Portions
            <div>:</div>
          </div>
          <ul className="list-disc list-inside text-sm text-gray-700 font-semibold">
            {item.portionPrices.map((portion, index) => (
              <li key={index} className="flex">
                <div className="w-32">Portion: {portion.portion}</div>
                <div className="w-32">Price: ₹{portion.price}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FoodItemModal;
