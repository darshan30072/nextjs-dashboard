'use client';

import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";

export default function Profile() {

    return (
        <div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                <div className="bg-white rounded-xl font-semibold p-5">
                    <div className="flex justify-between items-center text-lg p-5 w-2/5 rounded-xl border border-gray-200 mb-3">
                        <Link href={'/categories'} className="flex items-center gap-3">
                            <TbCategoryPlus />
                            Categories
                        </Link>
                        <MdKeyboardArrowRight className="text-end" />
                    </div>
                </div>
            </div>
        </div>
    );
}