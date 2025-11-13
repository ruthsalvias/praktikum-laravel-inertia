import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, List, Clock, CalendarDays } from "lucide-react";

export default function TodoStats({ stats = {} }) {
    const { total = 0, completed = 0, pending = 0, month_total = 0 } = stats;

    const items = [
        {
            key: "total",
            label: "Total",
            value: total,
            icon: <List className="w-5 h-5 text-white" />,
            bg: "from-blue-600 to-blue-500",
        },
        {
            key: "completed",
            label: "Selesai",
            value: completed,
            icon: <CheckCircle2 className="w-5 h-5 text-white" />,
            bg: "from-green-500 to-green-400",
        },
        {
            key: "pending",
            label: "Belum Selesai",
            value: pending,
            icon: <Clock className="w-5 h-5 text-white" />,
            bg: "from-yellow-400 to-yellow-300",
        },
        {
            key: "month",
            label: "Bulan Ini",
            value: month_total,
            icon: <CalendarDays className="w-5 h-5 text-white" />,
            bg: "from-purple-500 to-pink-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((it) => (
                <Card key={it.key} className="p-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${it.bg} shadow-md`}>
                            {it.icon}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm text-slate-500">{it.label}</div>
                            <div className="text-2xl font-bold text-slate-900">{it.value}</div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
