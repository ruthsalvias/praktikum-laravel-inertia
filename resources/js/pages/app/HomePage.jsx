import React from "react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { Plus, ArrowRight } from "lucide-react";

export default function HomePage() {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
                <div className="max-w-6xl w-full py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-block mb-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                            <span className="text-6xl relative z-10">👋</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                            Halo, {auth.name}
                        </h1>
                        <p className="text-xl text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            Kelola tugas Anda dengan mudah dan tingkatkan produktivitas
                        </p>
                        <Link href="/todos">
                            <Button className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white h-14 px-10 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group font-semibold">
                                <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                Buat Rencana Baru
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                        </Link>
                    </div>

                    {/* Quote Section */}
                    <div className="mt-12 max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 rounded-2xl p-8 text-center shadow-lg border border-blue-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
                            <div className="relative z-10">
                                <div className="text-6xl mb-4">💡</div>
                                <blockquote className="text-2xl md:text-3xl font-bold text-white mb-4 leading-relaxed">
                                    "Produktivitas bukan tentang melakukan lebih banyak, tapi tentang menyelesaikan hal yang tepat"
                                </blockquote>
                                <p className="text-blue-100 text-lg font-medium">— Mulai hari ini dengan fokus yang lebih baik</p>
                            </div>
                        </div>
                    </div>

                    {/* Mini Tips */}
                    <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="text-3xl mb-2">🎯</div>
                            <h4 className="font-bold text-slate-800 mb-1">Tetapkan Prioritas</h4>
                            <p className="text-sm text-slate-600">Fokus pada tugas terpenting terlebih dahulu</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="text-3xl mb-2">⏰</div>
                            <h4 className="font-bold text-slate-800 mb-1">Atur Waktu</h4>
                            <p className="text-sm text-slate-600">Buat deadline untuk setiap tugas Anda</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="text-3xl mb-2">✅</div>
                            <h4 className="font-bold text-slate-800 mb-1">Rayakan Kemenangan</h4>
                            <p className="text-sm text-slate-600">Setiap tugas selesai adalah progress</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}