// lib/auth/supabaseAuthUtils.js (CORRECTED)

import { supabaseServer } from '@/lib/supabaseServer'; // Import your server client utility

/**
 * Retrieves the authenticated user's ID from the server session.
 * Must be called from Server Components or Server Actions.
 * * @returns {Promise<string | null>} The user's ID or null if not authenticated.
 */
export async function getUserId() {
    try {
        // 1. Get the pre-configured server client
        const supabase = await supabaseServer(); // ✅ ADDED 'await'

        // 2. Fetch the current user session securely from cookies
        const { data: { user } } = await supabase.auth.getUser();

        return user?.id ?? null;
    } catch (error) {
        console.error("Error retrieving user ID on server:", error);
        return null;
    }
}