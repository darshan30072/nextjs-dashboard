'use client';

import React from 'react';

export default function Loader({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-6 text-gray-500 text-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-2 border-b-2 border-orange-500 mb-5"></div>
            {message}
        </div>
    );
}
