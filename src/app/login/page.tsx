"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/app/components/auth/AuthModal";

export default function LoginPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <AuthModal
        isOpen={isOpen}
        onClose={() => router.push("/")}
        defaultTab="login"
        onSuccess={() => router.push("/dashboard")}
      />
    </div>
  );
}
