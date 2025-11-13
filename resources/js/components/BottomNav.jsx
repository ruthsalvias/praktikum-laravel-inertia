import React from 'react';
import { Home, PlusCircle, Calendar } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function BottomNav() {
    return (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center md:hidden pointer-events-auto z-50">
            <div className="w-[92%] max-w-2xl bg-white rounded-full shadow-lg p-3 flex items-center justify-between px-6">
                <Link href="/" className="text-slate-600"><Home size={20} /></Link>
                <Link href="/todos" className="text-slate-600"><Calendar size={20} /></Link>
                <Link href="/todos" className="bg-blue-600 text-white p-3 rounded-full shadow-lg -mt-6"><PlusCircle size={26} /></Link>
                <a className="text-slate-600"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="#334155" strokeWidth="1.5"/></svg></a>
            </div>
        </div>
    );
}
