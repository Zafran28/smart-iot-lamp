"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { Home } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // ✅ CHECK SESSION ON LOAD
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.replace("/smart-home");
      } else {
        setChecking(false);
      }
    };

    checkSession();
  }, [router]);

  // ✅ LISTEN AUTH CHANGE
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          router.replace("/smart-home");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // ✅ LOGIN HANDLER (FIXED ERROR HANDLING)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          alert(
            "❌ Email belum dikonfirmasi.\n\n" +
            "Solusi:\n" +
            "- Cek inbox / spam Gmail\n" +
            "- Klik link verifikasi\n" +
            "- Atau admin klik 'Confirm email' di Supabase"
          );
          return;
        }

        if (error.message.includes("Invalid login credentials")) {
          alert("❌ Email atau password salah.");
          return;
        }

        if (error.message.includes("Too many requests")) {
          alert("❌ Terlalu banyak percobaan login. Coba lagi nanti.");
          return;
        }

        alert("❌ Login gagal: " + error.message);
        return;
      }

      router.replace("/smart-home");
    } catch {
      alert("❌ Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADING SCREEN
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Checking session...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="mb-2 flex justify-center">
  <Home size={64} className="text-green-500" strokeWidth={2.5} />
</div>
          <h1 className="text-4xl font-bold text-white">Floora</h1>
          <p className="text-slate-400">Smart Home System</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className={`w-full rounded-xl py-3 font-semibold transition ${
              loading || !email || !password
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Loading..." : "Login"}
          </button>

        </form>

        {/* REGISTER */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-blue-400 hover:text-blue-300 transition"
          >
            Belum punya akun? Daftar
          </button>
        </div>

      </div>
    </main>
  );
}