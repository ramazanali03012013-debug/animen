"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const supabase = createClient();
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        else {
          setInfo("Hesap oluşturuldu. E-posta doğrulaması gerekebilir.");
          router.refresh();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        else router.push("/");
      }
    } catch (e) {
      setError("Bir hata oluştu: " + String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-animen-dark border border-animen-gray rounded-xl p-8">
        <h1 className="text-2xl font-extrabold mb-1">
          {isRegister ? "Kayıt Ol" : "Giriş Yap"}
        </h1>
        <p className="text-sm text-animen-light/60 mb-6">Animen topluluğuna katıl</p>

        <label className="block text-sm mb-1">E-posta</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 rounded-md bg-animen-black border border-animen-gray px-3 py-2 text-white focus:outline-none focus:border-animen-red"
        />

        <label className="block text-sm mb-1">Şifre</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 rounded-md bg-animen-black border border-animen-gray px-3 py-2 text-white focus:outline-none focus:border-animen-red"
        />

        {error && <p className="text-animen-red text-sm mb-3">{error}</p>}
        {info && <p className="text-green-400 text-sm mb-3">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-md bg-animen-red hover:bg-animen-red-dark text-white font-semibold transition disabled:opacity-50"
        >
          {loading ? "Lütfen bekleyin..." : isRegister ? "Kayıt Ol" : "Giriş Yap"}
        </button>

        <p className="text-center text-sm text-animen-light/60 mt-4">
          {isRegister ? (
            <>
              Zaten hesabın var mı?{" "}
              <Link href="/giris" className="text-animen-red">Giriş yap</Link>
            </>
          ) : (
            <>
              Hesabın yok mu?{" "}
              <Link href="/kayit" className="text-animen-red">Kayıt ol</Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
