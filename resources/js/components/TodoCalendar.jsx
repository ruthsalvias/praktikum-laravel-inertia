import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getMonthMatrix(year, month) {
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay(); // 0..6 (Sun..Sat)
    const weeks = [];
    let current = new Date(year, month, 1 - startDay);
    for (let w = 0; w < 6; w++) {
        const week = [];
        for (let d = 0; d < 7; d++) {
            week.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        weeks.push(week);
    }
    return weeks;
}

export default function TodoCalendar({ todos = [], selectedDate, onSelectDate }) {
    const [view, setView] = useState(() => {
        const d = selectedDate ? new Date(selectedDate) : new Date();
        return { year: d.getFullYear(), month: d.getMonth() };
    });

    const weeks = useMemo(() => getMonthMatrix(view.year, view.month), [view]);

    const marks = useMemo(() => {
        const s = {};
        todos.forEach((t) => {
            try {
                const d = new Date(t.created_at);
                const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                s[key] = (s[key] || 0) + 1;
            } catch (e) {}
        });
        return s;
    }, [todos]);

    const goPrev = () => {
        const m = view.month - 1;
        if (m < 0) setView({ year: view.year - 1, month: 11 });
        else setView({ ...view, month: m });
    };
    const goNext = () => {
        const m = view.month + 1;
        if (m > 11) setView({ year: view.year + 1, month: 0 });
        else setView({ ...view, month: m });
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-sm text-slate-500">{new Date(view.year, view.month).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={goPrev} className="p-2 rounded hover:bg-slate-100"><ChevronLeft size={16} /></button>
                    <button onClick={goNext} className="p-2 rounded hover:bg-slate-100"><ChevronRight size={16} /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-xs text-center text-slate-500 mb-2">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
                    <div key={d} className="py-1">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {weeks.map((week, wi) => (
                    <React.Fragment key={wi}>
                        {week.map((d, i) => {
                            const isCurrentMonth = d.getMonth() === view.month;
                            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                            const count = marks[key] || 0;
                            const isSelected = selectedDate && (new Date(selectedDate).toDateString() === d.toDateString());
                            return (
                                <button
                                    key={i}
                                    onClick={() => onSelectDate(new Date(d))}
                                    className={`p-2 rounded-lg h-10 flex flex-col items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : isCurrentMonth ? 'bg-white' : 'bg-transparent text-slate-400'} hover:shadow-sm`}
                                >
                                    <div className="text-sm">{d.getDate()}</div>
                                    {count > 0 && <div className={`mt-1 w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`}></div>}
                                </button>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </Card>
    );
}
