import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Calendar, Clock, CheckCircle, Circle } from 'lucide-react';

export default function TodoDetail({ todo, open, onClose }) {
    if (!open || !todo) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" 
                onClick={onClose}
            ></div>
            
            {/* Modal Card */}
            <Card className="z-50 max-w-3xl w-full mx-4 relative shadow-2xl border-slate-200 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-6 rounded-t-lg">
                    <button 
                        onClick={onClose} 
                        className="absolute right-4 top-4 p-2 rounded-lg hover:bg-white/20 transition-colors text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <h2 className="text-2xl font-bold text-white mb-2 pr-10">{todo.title}</h2>
                    
                    <div className="flex items-center gap-4 text-blue-50 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(todo.created_at).toLocaleDateString('id-ID', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                            })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(todo.created_at).toLocaleTimeString('id-ID', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}</span>
                        </div>
                    </div>
                </div>

                {/* Cover Image: show full image (contain) and let modal adapt to image height; cap with max-height */}
                {todo.cover && (
                    <div className="w-full flex justify-center bg-slate-100">
                        <img
                            src={todo.cover}
                            alt={todo.title}
                            className="w-full h-auto max-h-[60vh] object-contain"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {/* Status Badge */}
                    <div className="mb-6">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm border ${
                            todo.is_finished 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                            {todo.is_finished ? (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Tugas Selesai</span>
                                </>
                            ) : (
                                <>
                                    <Circle className="w-4 h-4" />
                                    <span>Belum Selesai</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Deskripsi</h3>
                        <div 
                            className="prose prose-slate max-w-none text-slate-700 leading-relaxed" 
                            dangerouslySetInnerHTML={{ 
                                __html: todo.description || '<p class="text-slate-400 italic">Tidak ada deskripsi</p>' 
                            }} 
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div className="text-sm text-slate-500">
                            Dibuat {new Date(todo.created_at).toLocaleDateString('id-ID')}
                        </div>
                        <Button 
                            onClick={onClose} 
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg px-6"
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}