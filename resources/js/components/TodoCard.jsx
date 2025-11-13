import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Edit2, Trash2, Calendar, Eye } from "lucide-react";
import Swal from "sweetalert2";
import TodoDetail from "./TodoDetail";

export default function TodoCard({ todo, onEdit, onDelete, onToggle }) {
    const [loading, setLoading] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
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
                    timer: 2000,
                });
                onToggle?.(result.todo);
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
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Hapus Todo?",
            text: "Tindakan ini tidak dapat dibatalkan!",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
        });

        if (!confirm.isConfirmed) return;

        setLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const headers = {
                "X-Requested-With": "XMLHttpRequest",
                Accept: "application/json",
            };
            if (csrfToken) headers["X-CSRF-TOKEN"] = csrfToken;

            const response = await fetch(`/todos/${todo.id}`, {
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
                    timer: 2000,
                });
                onDelete?.(todo.id);
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
            setLoading(false);
        }
    };

    return (
        <Card className={`overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300 group ${
            todo.is_finished ? "opacity-60" : ""
        }`}>
            {/* Cover Image */}
            {todo.cover && (
                <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 relative">
                    <img
                        src={todo.cover}
                        alt={todo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
                </div>
            )}

            {/* Content */}
            <div className="p-6 bg-white">
                {/* Title with Status */}
                <div className="flex items-start gap-3 mb-3">
                    <button
                        onClick={handleToggle}
                        disabled={loading}
                        className="shrink-0 mt-1 hover:scale-125 transition-all duration-200 focus:outline-none"
                        title="Toggle completion status"
                    >
                        {todo.is_finished ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500 animate-pulse" />
                        ) : (
                            <Circle className="w-6 h-6 text-slate-300 hover:text-blue-500 transition-colors" />
                        )}
                    </button>
                    <div className="flex-1 min-w-0">
                        <h3
                            className={`text-lg font-bold transition-all ${
                                todo.is_finished
                                    ? "line-through text-slate-400"
                                    : "text-slate-900"
                            }`}
                        >
                            {todo.title}
                        </h3>
                    </div>
                </div>

                {/* Description */}
                {todo.description && (
                    <div className="mb-4 text-sm text-slate-600 line-clamp-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: todo.description.substring(0, 150),
                            }}
                        />
                    </div>
                )}

                {/* Date + Time */}
                <div className="mb-4 text-xs text-slate-500 flex items-center gap-3">
                    <Calendar size={14} />
                    <div>
                        <div>{new Date(todo.created_at).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}</div>
                        <div className="text-[11px] text-slate-400">{new Date(todo.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <Button
                        size="sm"
                        onClick={() => setShowDetail(true)}
                        disabled={loading}
                        className="flex-1 bg-white text-slate-700 border hover:shadow-sm"
                    >
                        <Eye size={14} className="mr-2" />
                        Lihat
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => onEdit?.(todo)}
                        disabled={loading}
                        className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg"
                    >
                        <Edit2 size={14} />
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg"
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
                <TodoDetail todo={todo} open={showDetail} onClose={() => setShowDetail(false)} />
            </div>
        </Card>
    );
}
