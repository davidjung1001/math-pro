'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle, Circle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function QuestionReviewButton({ questionId, initialReviewed }) {
  const [isReviewed, setIsReviewed] = useState(initialReviewed || false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleReview = async () => {
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('questions')
        .update({ reviewed: !isReviewed })
        .eq('id', questionId);

      if (error) throw error;

      setIsReviewed(!isReviewed);
    } catch (error) {
      console.error('Error updating review status:', error);
      alert('Failed to update review status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={toggleReview}
      disabled={isUpdating}
      className={`p-2 rounded-lg transition-all ${
        isReviewed 
          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
      } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isReviewed ? 'Mark as unreviewed' : 'Mark as reviewed'}
    >
      {isReviewed ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <Circle className="w-5 h-5" />
      )}
    </button>
  );
}