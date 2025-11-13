import React from 'react';
import { X } from 'lucide-react';
import TodoForm from '@/components/TodoForm';

export default function TodoFormModal({ todo, onSuccess, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onCancel}></div>

            <div className="relative w-full max-w-2xl mx-4">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="flex items-center justify-between p-3 border-b">
                        <div className="text-lg font-semibold">{todo ? 'Edit Todo' : 'Tambah Todo'}</div>
                        <button onClick={onCancel} className="p-2 rounded hover:bg-slate-100">
                            <X size={18} />
                        </button>
                    </div>

                        <div className="p-3">
                        <TodoForm todo={todo} onSuccess={onSuccess} onCancel={onCancel} />
                    </div>
                </div>
            </div>
        </div>
    );
}
