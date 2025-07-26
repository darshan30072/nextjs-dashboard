import { useEffect, useState } from "react";

export interface DashboardStat {
    label: string;
    value: string;
    iconName: "cart" | "knife";
}

export function useDashboardVM() {
    const [statsLoading, setStatsLoading] = useState(true);

    const stats: DashboardStat[] = [
        { iconName: "cart", label: "Running Orders", value: "55" },
        { iconName: "knife", label: "Requested Orders", value: "15" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        statsLoading,
        stats,
        // pendingOrders
    };
}
