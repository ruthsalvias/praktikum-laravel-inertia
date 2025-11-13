import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Menu, X } from "lucide-react";

export default function AppLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const onLogout = () => {
        router.get("/auth/logout");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
            {/* Modern Navigation */}
            <nav className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg group-hover:shadow-lg transition-all">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    RuthTodos
                                </span>
                            </Link>
                            <div className="hidden md:flex items-center space-x-6">
                                <Link
                                    href="/"
                                    className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative group"
                                >
                                    Dashboard
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
                                </Link>
                                <Link
                                    href="/todos"
                                    className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative group"
                                >
                                    Todos
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
                                </Link>
                            </div>
                        </div>

                        {/* Desktop Logout Button */}
                        <div className="hidden md:block">
                            <Button
                                onClick={onLogout}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all"
                            >
                                Logout
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden pb-4 space-y-3">
                            <Link
                                href="/"
                                className="block text-sm font-medium text-slate-600 hover:text-blue-600"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/todos"
                                className="block text-sm font-medium text-slate-600 hover:text-blue-600"
                            >
                                Todos
                            </Link>
                            <Button
                                onClick={onLogout}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            >
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Modern Footer */}
            <footer className="bg-white border-t border-slate-200 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-3">RuthTodos</h3>
                            <p className="text-sm text-slate-600">Aplikasi manajemen todo yang modern dan intuitif.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-3">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><Link href="/" className="hover:text-blue-600">Dashboard</Link></li>
                                <li><Link href="/todos" className="hover:text-blue-600">Todos</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-3">Support</h3>
                            <p className="text-sm text-slate-600">Butuh bantuan? Hubungi tim kami.</p>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
                        &copy; 2025 Delcom Labs. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}