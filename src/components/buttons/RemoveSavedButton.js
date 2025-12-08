'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function RemoveSavedButton({ quizId, savedId }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling

    if (!confirm('Remove this worksheet from saved?')) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('user_saved_quizzes')
        .delete()
        .eq('id', savedId);

      if (error) throw error;

      // Refresh the page to show updated list
      router.refresh();
    } catch (error) {
      console.error('Error removing saved worksheet:', error);
      alert('Failed to remove worksheet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isLoading}
      className="p-1.5 hover:bg-red-100 rounded-md transition-colors group/btn"
      title="Remove from saved"
    >
      <Trash2 
        className={`w-4 h-4 text-gray-400 group-hover/btn:text-red-600 transition ${
          isLoading ? 'animate-pulse' : ''
        }`} 
      />
    </button>
  );
}