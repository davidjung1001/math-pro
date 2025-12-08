'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Crown, Shield, Database, HelpCircle } from 'lucide-react';
import LoginModal from '@/components/auth/LoginModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserHeader() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState('free');
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('plan, is_admin')
          .eq('id', session.user.id)
          .single();
        
        setUserPlan(profile?.plan || 'free');
        setIsAdmin(profile?.is_admin || false);
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          supabase
            .from('user_profiles')
            .select('plan, is_admin')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }) => {
              setUserPlan(profile?.plan || 'free');
              setIsAdmin(profile?.is_admin || false);
            });
        } else {
          setUserPlan('free');
          setIsAdmin(false);
        }
      });
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    router.refresh(); 
    window.location.href = '/'; 
  };

  const handleLoginSuccess = (userData) => {
    setShowLoginModal(false);
    setUser(userData);
    
    console.log('Login Success in Header. Refreshing server state and navigating...');
    router.refresh();
    router.push('/');
  };

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User';
  const userInitials = firstName[0].toUpperCase();
  const isPremium = userPlan === 'premium';

  return (
    <>
      <div className="absolute top-4 right-10 z-50 sm:top-6 sm:right-6">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition ring-1 ring-gray-300 sm:p-2"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-300 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-700 uppercase shadow-sm">
                {userInitials}
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 z-50 text-sm">
                {/* User Info Header */}
                <div className="p-3 font-medium text-gray-900 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span>Hello, {firstName}</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {isPremium && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        <Crown className="w-3 h-3" /> Premium
                      </span>
                    )}
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </div>
                </div>

                {/* Regular User Links */}
                <div className="py-1">
                  <Link 
                    href="/dashboard" 
                    className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  {!isPremium && (
                    <Link 
                      href="/auth/subscribe" 
                      className="block px-4 py-2 text-amber-600 hover:bg-amber-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Upgrade to Premium
                    </Link>
                  )}
                </div>

                {/* Admin Section */}
                {isAdmin && (
                  <>
                    <div className="border-t border-gray-200 my-1"></div>
                    <div className="py-1 bg-blue-50">
                      <div className="px-4 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                        Admin Tools
                      </div>
                      
                      <Link 
                        href="/admin" 
                        className="block px-4 py-2 hover:bg-blue-100 transition-colors text-blue-900"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/admin/editor" 
                        className="block px-4 py-2 hover:bg-blue-100 transition-colors text-blue-900"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4" />
                          <span>Lesson Editor</span>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/admin/question-editor" 
                        className="block px-4 py-2 hover:bg-blue-100 transition-colors text-blue-900"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4" />
                          <span>Question Editor</span>
                        </div>
                      </Link>
                    </div>
                  </>
                )}

                {/* Logout */}
                <div className="border-t border-gray-200 py-1">
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-gray-200 text-gray-700 font-medium text-xs sm:text-sm px-3 py-1.5 rounded-md hover:bg-gray-300 transition shadow-none"
          >
            Login
          </button>
        )}
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}