"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import App from "@/app/App";
import { AuthModal } from "@/app/components/auth/AuthModal";
import { fetchCurrentUser } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetchCurrentUser();
        if (res && res.user) {
          setCurrentUser(res.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setShowAuthModal(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setShowAuthModal(true);
      }
    }
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-amber-400">Verifying Neon DB Credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="max-w-md p-8 rounded-3xl border border-amber-500/20 bg-[#1E3A5F] shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-xs text-slate-300 mb-6">
            Please log in or create a counselor account to access the Kintsu Classroom & Rehabilitation Suite.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-lg hover:bg-amber-400 transition-all cursor-pointer"
          >
            Log In or Sign Up
          </button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => router.push("/")}
          defaultTab="login"
          onSuccess={(userData) => {
            if (userData) setCurrentUser(userData);
            setIsAuthenticated(true);
          }}
        />
      </div>
    );
  }

  return <App initialUser={currentUser} />;
}
