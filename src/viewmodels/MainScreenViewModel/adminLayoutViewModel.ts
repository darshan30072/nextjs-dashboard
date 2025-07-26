'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

function formatRouteTitle(path: string) {
    const segments = path.split('/').filter(Boolean);
    if (segments[0] === 'foodItem') return 'Food Items';
    const last = segments[segments.length - 1] || "Unknown";
    return last.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function useAdminLayoutVM() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const pageTitle = formatRouteTitle(pathname);

    const goToNotifications = useCallback(() => {
        router.push('/notification');
    }, [router]);

    const goToProfile = useCallback(() => {
        router.push('/profile');
    }, [router]);

    // Set collapsed state based on screen width
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1024 && width < 1280) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };

        handleResize(); // run on mount
        window.addEventListener('resize', handleResize); // update on resize

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        sidebarOpen,
        setSidebarOpen,
        collapsed,
        setCollapsed,
        pageTitle,
        goToNotifications,
        goToProfile,
    };
}
