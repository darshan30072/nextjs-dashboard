'use client';
import { useState, useRef, useEffect } from 'react';
import { Category } from '@/interface/categoryTypes';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

interface MultiSelectDropdownProps {
    dynamicCategories: Category[];
    selectedCategories: string[];
    setSelectedCategories: (cats: string[]) => void;
}

export default function MultiSelectDropdown({
    dynamicCategories,
    selectedCategories,
    setSelectedCategories,
}: MultiSelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleCategory = (cat: string) => {
        if (cat === 'All') {
            setSelectedCategories(['All']);
        } else {
            let updated = [...selectedCategories];
            if (updated.includes(cat)) {
                updated = updated.filter(c => c !== cat);
            } else {
                updated = updated.filter(c => c !== 'All'); // remove "All" if selecting specific
                updated.push(cat);
            }
            if (updated.length === 0) updated = ['All'];
            setSelectedCategories(updated);
        }
    };

    return (
        <div className="relative w-[130px]" ref={dropdownRef}>
            <div className="flex gap-2 min-w-max p-1 bg-gray-100 rounded-xl" onClick={() => setIsOpen(!isOpen)}>
                <div className="text-xl py-2 px-1">
                    <HiOutlineAdjustmentsHorizontal />
                </div>
                <button
                    className="flex justify-between items-center gap-1 min-w-[130px] px-2 rounded-lg bg-orange-500  hover:bg-orange-600 text-left text-white text-sm"
                >
                    <div>
                        {selectedCategories.length > 0 ? selectedCategories.join(' , ') : 'Select Categories'}
                    </div>
                    <div className='text-4xl'>
                        <RiArrowDropDownLine />
                    </div>
                </button>
            </div>
            {/* top-0 left-45 */}
            {isOpen && (
                <div className="absolute top-0 left-45 mt-2 z-50 bg-orange-100 border border-gray-300 rounded-xl shadow min-w-48 max-h-60 overflow-y-auto text-orange-500 text-sm font-semibold [&::-webkit-scrollbar]:hidden scrollbar-hide">
                    <div className="p-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes('All')}
                                onChange={() => toggleCategory('All')}
                            />
                            All
                        </label>
                        {dynamicCategories.map(cat => {
                            const val = cat.title.toUpperCase();
                            return (
                                <label key={cat.id_int} className="flex items-center gap-2 mt-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={val}
                                        checked={selectedCategories.includes(val)}
                                        onChange={() => toggleCategory(val)}
                                    />
                                    {cat.title}
                                </label>
                            );
                        })}
                    </div>
                </div>
            )
            }
        </div >
    );
}
