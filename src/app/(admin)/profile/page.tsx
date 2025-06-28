'use client';

import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";

export default function Profile() {

    return (
        <>
            <div className="p-4 sm:p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
                <div className=" bg-white rounded-xl shadow font-bold border border-gray-200 p-4 sm:p-6">
                    <div className="flex justify-between items-center text-lg p-5 w-2/5 rounded-xl border border-gray-200 mb-3">
                        <Link href={'/categories'} className="flex items-center gap-3">
                            <TbCategoryPlus />
                            Categories
                        </Link>
                        <MdKeyboardArrowRight className="text-end" />
                    </div>
                </div>
            </div>
        </>
    );
}