import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TodoForm from "@/components/TodoForm";
import TodoFormModal from '@/components/TodoFormModal';
import TodoStats from "@/components/TodoStats";
import TodoChart from "@/components/TodoChart";
import BottomNav from "@/components/BottomNav";
import { Search, Plus, Edit2, Eye, Trash2, Image as ImageIcon } from "lucide-react";
import TodoDetail from '@/components/TodoDetail';
import Swal from "sweetalert2";

export default function TodoPage({ todos, stats, search: initialSearch }) {
    const [showForm, setShowForm] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [searchQuery, setSearchQuery] = useState(initialSearch || "");
    const [statusFilter, setStatusFilter] = useState("all");
    const [localTodos, setLocalTodos] = useState(todos.data || []);
    const [localStats, setLocalStats] = useState(stats);
    const [detailTodo, setDetailTodo] = useState(null);
    // Keep a static recent todos list (don't change when paginating)
    const [recentTodos] = useState(() => (todos.data || []).slice(0, 6));
    // Keep today's tasks stable across pagination (snapshot from initial data)
    const [todaysTasks, setTodaysTasks] = useState(() => {
        const todayKey = new Date().toDateString();
        return (todos.data || []).filter(t => new Date(t.created_at).toDateString() === todayKey);
    });

    useEffect(() => {
        setLocalTodos(todos.data || []);
    }, [todos]);

    useEffect(() => {
        setLocalStats(stats);
    }, [stats]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const timer = setTimeout(() => {
            router.get(
                "/todos",
                { search: query, status: statusFilter },
                { replace: true, preserveState: true }
            );
        }, 500);

        return () => clearTimeout(timer);
    };

    const handleStatusChange = (e) => {
        const value = e.target.value;
        setStatusFilter(value);
        router.get(
            "/todos",
            { search: searchQuery, status: value },
            { replace: true, preserveState: true }
        );
    };

    const handleAddNew = () => {
        setEditingTodo(null);
        setShowForm(true);
    };

    const handleEditTodo = (todo) => {
        setEditingTodo(todo);
        setShowForm(true);
    };

    const handleFormSuccess = (newTodo) => {
        setShowForm(false);
        if (newTodo) {
            if (editingTodo) {
                setLocalTodos((prev) =>
                    prev.map((t) => (t.id === newTodo.id ? newTodo : t))
                );

                setLocalStats((prev) => {
                    const prevTodo = localTodos.find((t) => t.id === newTodo.id) || {};
                    if (!prevTodo) return prev;
                    if (prevTodo.is_finished === newTodo.is_finished) return prev;

                    if (newTodo.is_finished) {
                        return {
                            ...prev,
                            completed: prev.completed + 1,
                            pending: prev.pending - 1,
                        };
                    } else {
                        return {
                            ...prev,
                            completed: prev.completed - 1,
                            pending: prev.pending + 1,
                        };
                    }
                });
            } else {
                setLocalTodos((prev) => [newTodo, ...prev]);
                setLocalStats((prev) => ({
                    ...prev,
                    total: prev.total + 1,
                    pending: prev.pending + (newTodo.is_finished ? 0 : 1),
                    completed: prev.completed + (newTodo.is_finished ? 1 : 0),
                }));
                // If the new todo is for today, add to today's tasks snapshot
                if (new Date(newTodo.created_at).toDateString() === new Date().toDateString()) {
                    setTodaysTasks((prev) => [newTodo, ...prev]);
                }
            }
        } else {
            router.get("/todos", { search: searchQuery }, { preserveState: true });
        }

        setEditingTodo(null);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingTodo(null);
    };

    const handleDeleteTodo = async (todoId) => {
        const targetTodo = localTodos.find((t) => t.id === todoId);
        const confirmed = await Swal.fire({
            icon: "warning",
            title: "Hapus Todo?",
            text: "Tindakan ini tidak dapat dibatalkan!",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
        });

        if (!confirmed.isConfirmed) return;

        setLoadingMap((prev) => ({ ...prev, [todoId]: true }));

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const headers = {
                "X-Requested-With": "XMLHttpRequest",
                Accept: "application/json",
            };
            if (csrfToken) headers["X-CSRF-TOKEN"] = csrfToken;

            const response = await fetch(`/todos/${todoId}`, {
                method: "DELETE",
                headers,
                credentials: 'include',
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: result.message,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                });

                setLocalTodos((prev) => prev.filter((t) => t.id !== todoId));
                setLocalStats((prev) => {
                    const updated = { ...prev, total: Math.max(0, prev.total - 1) };
                    if (targetTodo) {
                        if (targetTodo.is_finished) {
                            updated.completed = Math.max(0, (updated.completed || 0) - 1);
                        } else {
                            updated.pending = Math.max(0, (updated.pending || 0) - 1);
                        }
                    }
                    return updated;
                });

                router.get('/todos', { search: searchQuery, status: statusFilter }, { preserveState: true });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: result.message || 'Gagal menghapus todo',
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: error.message || "Terjadi kesalahan",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
            });
        } finally {
            setLoadingMap((prev) => ({ ...prev, [todoId]: false }));
        }
    };

    const handleToggleTodo = (updatedTodo) => {
        setLocalTodos(
            localTodos.map((t) =>
                t.id === updatedTodo.id ? updatedTodo : t
            )
        );

        if (updatedTodo.is_finished) {
            setLocalStats((prev) => ({
                ...prev,
                completed: prev.completed + 1,
                pending: prev.pending - 1,
            }));
        } else {
            setLocalStats((prev) => ({
                ...prev,
                completed: prev.completed - 1,
                pending: prev.pending + 1,
            }));
        }

        // Keep todaysTasks in sync if the toggled todo is part of today's snapshot
        setTodaysTasks((prev) => prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    };

    const [loadingMap, setLoadingMap] = useState({});

    const toggleTodoRequest = async (todo) => {
        setLoadingMap((prev) => ({ ...prev, [todo.id]: true }));
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const headers = {
                "X-Requested-With": "XMLHttpRequest",
                Accept: "application/json",
            };
            if (csrfToken) headers["X-CSRF-TOKEN"] = csrfToken;

            const response = await fetch(`/todos/${todo.id}/toggle`, {
                method: "PUT",
                headers,
                credentials: 'include',
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: result.message,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                });

                handleToggleTodo(result.todo);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: result.message,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: error.message,
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
            });
        } finally {
            setLoadingMap((prev) => ({ ...prev, [todo.id]: false }));
        }
    };

    const today = new Date();

    const filteredTodos = localTodos.filter((t) => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'completed') return t.is_finished;
        if (statusFilter === 'pending') return !t.is_finished;
        return true;
    });

    const groupedTodos = filteredTodos
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .reduce((acc, todo) => {
            const key = new Date(todo.created_at).toDateString();
            if (!acc[key]) acc[key] = [];
            acc[key].push(todo);
            return acc;
        }, {});

    // Build numbering map: each date group resets to 1
    const pageNumberMap = (() => {
        const map = {};
        Object.entries(groupedTodos).forEach(([dateKey, todosForDate]) => {
            todosForDate.forEach((t, idx) => {
                map[t.id] = idx + 1; // Reset to 1 for each date
            });
        });
        return map;
    })();

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Hero Card - Elegant with better contrast */}
                <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl p-8 shadow-lg mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Catatan Todo</h2>
                        <p className="text-blue-50 mt-1">Kelola rencana dan todo Anda dengan mudah</p>
                    </div>
                    <div>
                        {!showForm && (
                            <Button onClick={handleAddNew} className="bg-white hover:bg-gray-50 text-blue-700 font-semibold shadow-md rounded-lg px-6">
                                <Plus size={16} className="mr-2" /> Tambah Todo
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats Row */}
                <div className="mb-8">
                    <TodoStats stats={localStats} />
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="relative w-full md:w-1/2">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <Input
                            type="text"
                            placeholder="Cari todo atau deskripsi..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-11 rounded-lg border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:border-blue-300 focus:ring-blue-200"
                        >
                            <option value="all">Semua</option>
                            <option value="completed">Selesai</option>
                            <option value="pending">Belum Selesai</option>
                        </select>

                        <Button variant="outline" className="rounded-lg" onClick={() => {
                            setStatusFilter('all');
                            setSearchQuery('');
                            router.get('/todos', { search: '', status: 'all' }, { replace: true, preserveState: true });
                        }}>Reset</Button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Chart */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                            <TodoChart todos={localTodos} />
                        </div>

                        {/* Today's Task */}
                        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl shadow-sm p-6 border border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Today's Task</h3>
                                <div className="text-sm text-slate-700 font-medium bg-white px-4 py-1.5 rounded-lg border border-slate-300 shadow-sm">{today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                            </div>
                            <div className="space-y-3">
                                {todaysTasks.map((t) => (
                                    <div key={t.id} className="flex items-start gap-3 p-4 rounded-xl bg-white shadow-sm border border-slate-200">
                                        <div className="shrink-0 mt-1">
                                            <input
                                                type="checkbox"
                                                checked={!!t.is_finished}
                                                onChange={() => toggleTodoRequest(t)}
                                                disabled={!!loadingMap[t.id]}
                                                aria-label={`Tandai ${t.title} sebagai selesai`}
                                                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-400"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-semibold text-slate-800 ${t.is_finished ? 'line-through text-slate-500' : ''}`}>{t.title}</div>
                                            <div className="text-xs text-slate-600 mt-1">{t.description ? t.description.replace(/<[^>]+>/g, '').slice(0,80) : ''}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm font-semibold ${t.is_finished ? 'text-emerald-700' : 'text-amber-700'}`}>{t.is_finished ? 'Selesai' : 'To Do'}</div>
                                            <div className="text-xs text-slate-500 mt-1">{new Date(t.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </div>
                                ))}
                                {localTodos.filter(t => new Date(t.created_at).toDateString() === today.toDateString()).length === 0 && (
                                    <div className="text-center text-slate-500 py-8">Tidak ada tugas untuk hari ini</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Todo Sidebar */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Todo</h3>
                            <div className="space-y-3">
                                {recentTodos.map((t) => (
                                    <div key={t.id} className="bg-slate-100 p-4 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">{t.title?.charAt(0) || 'T'}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-slate-800 truncate">{t.title}</div>
                                                <div className="text-xs text-slate-600 truncate mt-0.5">{t.description ? t.description.replace(/<[^>]+>/g, '').slice(0,40) : ''}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className={`text-xs px-3 py-1 rounded-lg font-semibold ${t.is_finished ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'}`}>
                                                {t.is_finished ? 'Selesai' : 'Aktif'}
                                            </span>
                                            <div className="text-xs text-slate-600 font-medium">{new Date(t.created_at).toLocaleDateString('id-ID')}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Todos Grid */}
                {showForm && (
                    <TodoFormModal todo={editingTodo} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
                )}

                {!showForm && (
                    <>
                        {filteredTodos.length > 0 ? (
                            <div>
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
                                    <div className="grid grid-cols-12 gap-4 items-center px-6 py-4 bg-slate-100 text-sm text-slate-700 font-semibold border-b border-slate-200">
                                        <div className="col-span-1"></div>
                                        <div className="col-span-1">#</div>
                                        <div className="col-span-2">Tanggal</div>
                                        <div className="col-span-3">Deskripsi</div>
                                        <div className="col-span-2">Status</div>
                                        <div className="col-span-1 text-right">Waktu</div>
                                        <div className="col-span-2 text-right">Aksi</div>
                                    </div>

                                    <div>
                                        {Object.keys(groupedTodos).length === 0 && (
                                            <div className="p-12 text-center text-slate-400">Tidak ada todo</div>
                                        )}

                                        {Object.entries(groupedTodos).map(([dateKey, todosForDate]) => (
                                            <div key={dateKey} className="py-4">
                                                <div className="mb-4 px-6">
                                                    <div className="inline-block bg-gradient-to-r from-slate-200 to-blue-200 px-4 py-2 rounded-lg text-slate-800 font-semibold text-sm border border-slate-300 shadow-sm">
                                                        {(new Date(dateKey)).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                </div>

                                                {todosForDate.map((todo, idx) => (
                                                    <div key={todo.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-slate-200 hover:bg-slate-50 transition-colors text-sm">
                                                        <div className="col-span-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!todo.is_finished}
                                                                onChange={() => toggleTodoRequest(todo)}
                                                                disabled={!!loadingMap[todo.id]}
                                                                aria-label={`Tandai ${todo.title} sebagai selesai`}
                                                                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-400"
                                                            />
                                                        </div>
                                                        <div className="col-span-1 text-slate-600 font-semibold">{pageNumberMap[todo.id] || (idx + 1)}</div>
                                                        <div className="col-span-2">
                                                            <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-lg text-xs border border-blue-200">
                                                                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                                <span className="text-blue-800 font-semibold">{new Date(todo.created_at).toLocaleDateString('id-ID')}</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-3 text-slate-800 truncate font-semibold">{todo.title || (todo.description ? todo.description.replace(/<[^>]+>/g, '').slice(0,100) : '-')}</div>
                                                        <div className="col-span-2">
                                                            <span className={`${todo.is_finished ? 'bg-emerald-200 text-emerald-900 border-emerald-300' : 'bg-amber-200 text-amber-900 border-amber-300'} inline-block px-3 py-1.5 rounded-lg text-xs font-bold border`}>
                                                                {todo.is_finished ? 'Selesai' : 'Aktif'}
                                                            </span>
                                                        </div>
                                                        <div className="col-span-1 text-right text-slate-600 font-semibold">{new Date(todo.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                                                        <div className="col-span-2 text-right flex items-center justify-end gap-2">
                                                            <button onClick={() => handleEditTodo(todo)} className="p-2 rounded-lg text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            {todo.cover ? (
                                                                <a href={todo.cover} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors border border-slate-200">
                                                                    <ImageIcon size={14} />
                                                                </a>
                                                            ) : null}
                                                            <button onClick={() => setDetailTodo(todo)} className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all shadow-sm">
                                                                <Eye size={14} />
                                                            </button>
                                                            <button onClick={() => handleDeleteTodo(todo.id)} className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all shadow-sm">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pagination */}
                                {todos.links && todos.links.length > 0 && (
                                    <div className="flex justify-center gap-2 mt-6 items-center">
                                        <Button
                                            className="rounded-lg"
                                            onClick={() => {
                                                if (!todos.prev_page_url) return;
                                                const url = new URL(todos.prev_page_url);
                                                const page = url.searchParams.get('page');
                                                router.get('/todos', { page: page, search: searchQuery, status: statusFilter }, { preserveState: true });
                                            }}
                                            disabled={!todos.prev_page_url}
                                        >
                                            Previous
                                        </Button>

                                        {todos.links.map((link, index) => {
                                            const lbl = String(link.label || '');
                                            if (/(pagination\.previous|pagination\.next|&laquo;|&raquo;)/i.test(lbl)) {
                                                return null;
                                            }

                                            const isEllipsis = lbl === '...';

                                            return (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    className="rounded-lg"
                                                    onClick={() => {
                                                        if (!link.url) return;
                                                        try {
                                                            const url = new URL(link.url);
                                                            const page = url.searchParams.get('page');
                                                            router.get('/todos', { page: page, search: searchQuery, status: statusFilter }, { preserveState: true });
                                                        } catch (e) {}
                                                    }}
                                                    disabled={!link.url}
                                                >
                                                    {isEllipsis ? '...' : lbl}
                                                </Button>
                                            );
                                        })}

                                        <Button
                                            className="rounded-lg"
                                            onClick={() => {
                                                if (!todos.next_page_url) return;
                                                const url = new URL(todos.next_page_url);
                                                const page = url.searchParams.get('page');
                                                router.get('/todos', { page: page, search: searchQuery, status: statusFilter }, { preserveState: true });
                                            }}
                                            disabled={!todos.next_page_url}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-100">
                                <p className="text-slate-500 text-lg">{searchQuery ? 'Tidak ada todo yang sesuai dengan pencarian' : 'Belum ada todo. Buat todo baru untuk memulai!'}</p>
                            </div>
                        )}
                    </>
                )}

                {detailTodo && (
                    <TodoDetail todo={detailTodo} open={!!detailTodo} onClose={() => setDetailTodo(null)} />
                )}
            </div>

            <BottomNav />

            <style>{`
                trix-toolbar {
                    border: 1px solid #e2e8f0;
                    border-bottom: none;
                    background: #f8fafc;
                    border-radius: 8px 8px 0 0;
                }
                trix-editor {
                    border: 1px solid #e2e8f0;
                    min-height: 200px;
                    border-radius: 0 0 8px 8px;
                }
            `}</style>
        </AppLayout>
    );
}