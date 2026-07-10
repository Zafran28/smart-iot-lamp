"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../app/lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/smart-home");
      } else {
        router.replace("/login");
      }
    };

    checkSession();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p className="mt-4">Memeriksa sesi...</p>
      </div>
    </main>
  );
}