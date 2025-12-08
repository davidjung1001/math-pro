// components/auth/LogoutButton.js
'use client';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Logout error:', error);
            // Handle error, maybe show a toast
        } 
    };

    return (
        <button 
            onClick={handleLogout} 
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
        >
            Logout
        </button>
    );
}