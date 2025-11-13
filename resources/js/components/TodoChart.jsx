import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { Card } from "@/components/ui/card";

export default function TodoChart({ todos = [] }) {
    // Build counts per month (last 6 months)
    const seriesAndOptions = useMemo(() => {
        const now = new Date();
        const months = [];
        const counts = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(d.toLocaleString("id-ID", { month: "short" }));
            counts.push(0);
        }

        todos.forEach((t) => {
            const d = new Date(t.created_at);
            const label = d.toLocaleString("id-ID", { month: "short" });
            const idx = months.indexOf(label);
            if (idx >= 0) counts[idx]++;
        });

        return {
            series: [
                {
                    name: "Todos",
                    data: counts,
                },
            ],
            options: {
                chart: {
                    toolbar: { show: false },
                    zoom: { enabled: false },
                },
                stroke: { curve: "smooth", width: 3 },
                colors: ["#4f46e5"],
                xaxis: { categories: months },
                grid: { strokeDashArray: 4 },
                dataLabels: { enabled: false },
                tooltip: { theme: "light" },
            },
        };
    }, [todos]);

    return (
        <Card className="p-4">
            <h3 className="text-lg font-bold mb-4">Analisis Todo (6 bulan)</h3>
            <div>
                <Chart options={seriesAndOptions.options} series={seriesAndOptions.series} type="area" height={260} />
            </div>
        </Card>
    );
}
