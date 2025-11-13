import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import Chart from "react-apexcharts";

export default function TodoStatistics({ stats }) {
    const chartOptions = useMemo(
        () => ({
            chart: {
                type: "donut",
                toolbar: {
                    show: false,
                },
            },
            colors: ["#10b981", "#f97316", "#6b7280"],
            labels: ["Selesai", "Dalam Proses", "Belum Dimulai"],
            legend: {
                position: "bottom",
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: "65%",
                    },
                },
            },
        }),
        []
    );

    const series = [
        stats.completed,
        stats.pending,
        Math.max(0, stats.total - stats.completed - stats.pending),
    ];

    const completionPercentage =
        stats.total > 0
            ? Math.round((stats.completed / stats.total) * 100)
            : 0;

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Statistik Todo</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart */}
                <div>
                    <Chart
                        options={chartOptions}
                        series={series}
                        type="donut"
                        height={300}
                    />
                </div>

                {/* Stats Info */}
                <div className="flex flex-col justify-center space-y-4">
                    <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-3xl font-bold text-blue-600">
                            {stats.total}
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-green-50 to-green-100 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Selesai</div>
                        <div className="text-3xl font-bold text-green-600">
                            {stats.completed}
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Pending</div>
                        <div className="text-3xl font-bold text-orange-600">
                            {stats.pending}
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">
                            Completion Rate
                        </div>
                        <div className="text-3xl font-bold text-purple-600">
                            {completionPercentage}%
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
