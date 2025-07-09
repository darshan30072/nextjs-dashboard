'use client';

import { useRouter } from "next/navigation";

export default function useProfileVM() {
  const router = useRouter();

  const goToCategories = () => {
    router.push("/categories");
  };

  return {
    goToCategories,
  };
}
