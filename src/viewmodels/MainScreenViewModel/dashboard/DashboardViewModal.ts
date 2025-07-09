import { useEffect, useState } from "react";
// import { getOrders } from "@/action/orders/getOrders";
// import { Order } from "@/interface/orderTypes";

export interface DashboardStat {
    label: string;
    value: string;
    iconName: "cart" | "knife";
}

export function useDashboardVM() {
    const [statsLoading, setStatsLoading] = useState(true);
    // const [pendingOrders, setPendingOrders] = useState<Order[]>([]);

    const stats: DashboardStat[] = [
        { iconName: "cart", label: "Running Orders", value: "55" },
        { iconName: "knife", label: "Requested Orders", value: "15" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Example of integrating real API:
                // const data = await getOrders();
                // Transform and filter data
                // setPendingOrders(...);
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
