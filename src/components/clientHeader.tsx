'use client';

import { useClientHeaderVM } from "@/viewmodels/ComponentViewModel/ClientHeaderViewModel";

export default function ClientHeader() {
    const { title } = useClientHeaderVM();
    return (
        <header className="text-xl font-semibold text-center">
            {title}
        </header>
    );
}