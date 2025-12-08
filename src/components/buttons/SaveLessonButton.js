'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Bookmark } from 'lucide-react';
import LoginModal from '@/components/auth/LoginModal';

export default function SaveLessonButton({ quizId, initialSaved = false }) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const toggleSave = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    console.log('Quiz ID passed to SaveLessonButton:', quizId);
    console.log('Quiz ID type:', typeof quizId);

    if (!quizId) {
      console.error('No quizId provided');
      alert('Unable to save worksheet - missing ID');
      return;
    }

    setIsLoading(true);

    try {
      const quizIdInt = typeof quizId === 'string' ? parseInt(quizId) : quizId;
      
      if (isSaved) {
        // Remove saved quiz
        const { error } = await supabase
          .from('user_saved_quizzes')
          .delete()
          .eq('user_id', user.id)
          .eq('quiz_id', quizIdInt);

        if (error) throw error;
        setIsSaved(false);
      } else {
        // Add saved quiz
        const { error } = await supabase
          .from('user_saved_quizzes')
          .insert({
            user_id: user.id,
            quiz_id: quizIdInt
          });

        if (error) throw error;
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling saved quiz:', error);
      alert('Failed to update saved worksheet: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (loggedInUser) => {
    setUser(loggedInUser);
    setShowLoginModal(false);
    
    if (!quizId) {
      console.error('No quizId provided');
      return;
    }
    
    // Auto-save quiz after login
    try {
      const { error } = await supabase
        .from('user_saved_quizzes')
        .insert({
          user_id: loggedInUser.id,
          quiz_id: quizId
        });

      if (!error) {
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error auto-saving quiz:', err);
    }
  };

  return (
    <>
      <button
        onClick={toggleSave}
        disabled={isLoading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
          isSaved
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isSaved ? 'Remove from saved' : 'Save this worksheet'}
      >
        <Bookmark
          className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}
        />
        <span className="font-medium hidden sm:inline">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      </button>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}