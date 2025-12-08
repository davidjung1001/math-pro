'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Heart } from 'lucide-react';
import LoginModal from '@/components/auth/LoginModal';

export default function SaveLessonButton({ subsectionId, initialSaved = false }) {
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

    if (!subsectionId) {
      console.error('No subsectionId provided');
      alert('Unable to save lesson - missing ID');
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        // Remove saved lesson
        const { error } = await supabase
          .from('user_saved_lessons')
          .delete()
          .eq('user_id', user.id)
          .eq('subsection_id', parseInt(subsectionId));

        if (error) throw error;
        setIsSaved(false);
      } else {
        // Add saved lesson
        const { error } = await supabase
          .from('user_saved_lessons')
          .insert({
            user_id: user.id,
            subsection_id: parseInt(subsectionId)
          });

        if (error) throw error;
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling saved lesson:', error);
      alert('Failed to update saved lesson: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (loggedInUser) => {
    setUser(loggedInUser);
    setShowLoginModal(false);
    
    if (!subsectionId) {
      console.error('No subsectionId provided');
      return;
    }
    
    // Auto-save lesson after login
    try {
      const { error } = await supabase
        .from('user_saved_lessons')
        .insert({
          user_id: loggedInUser.id,
          subsection_id: parseInt(subsectionId)
        });

      if (!error) {
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error auto-saving lesson:', err);
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
        title={isSaved ? 'Remove from saved' : 'Save this lesson'}
      >
        <Heart
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