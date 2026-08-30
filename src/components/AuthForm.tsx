"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { TurnstileWidget } from "./TurnstileWidget";

interface AuthFormProps {
  mode: "login" | "register";
  siteKey: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function AuthForm({ mode, siteKey }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";
  const needToken = !!siteKey;

  async function verifyToken(): Promise<boolean> {
    if (!needToken) return true;
    if (!token) {
      setError("Lütfen bot doğrulamasını yapın.");
      return false;
    }
    const res = await fetch("/api/check-turnstile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (!data.ok) {
      setError("Bot doğrulaması başarısız oldu.");
      return false;
    }
    return true;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    const ok = await verifyToken();
    if (!ok) return;

    setLoading(true);
    try {
      const supabase = createClient();
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${SITE_URL}/profil`,
            data: { username: username || undefined },
          },
        });
        if (error) setError(error.message);
        else if (data.user && data.user.identities?.length === 0) {
          setError("Bu e-posta zaten kayıtlı. Giriş yapmayı dene.");
        } else {
          setInfo(
            "Hesap oluşturuldu! Lütfen e-posta adresine gönderilen doğrulama linkine tıkla, sonra giriş yap."
          );
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

  async function forgotPassword() {
    if (!email) {
      setError("Şifre sıfırlamak için e-posta gir.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE_URL}/giris`,
      });
      if (error) setError(error.message);
      else setInfo("Şifre sıfırlama linki e-postana gönderildi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm glass border border-animen-gray rounded-2xl p-8 fade-in">
        <h1 className="text-2xl font-extrabold mb-1">
          {isRegister ? "Kayıt Ol" : "Giriş Yap"}
        </h1>
        <p className="text-sm text-animen-light/60 mb-6">Animen topluluğuna katıl</p>

        {isRegister && (
          <>
            <label className="block text-sm mb-1">Kullanıcı adı (opsiyonel)</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="kullanici_adi"
              className="w-full mb-4 rounded-md bg-animen-black border border-animen-gray px-3 py-2 text-white focus:outline-none focus:border-animen-red"
            />
          </>
        )}

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
          className="w-full mb-2 rounded-md bg-animen-black border border-animen-gray px-3 py-2 text-white focus:outline-none focus:border-animen-red"
        />

        {!isRegister && (
          <button
            type="button"
            onClick={forgotPassword}
            className="text-xs text-animen-light/50 hover:text-animen-red mb-4 block"
          >
            Şifremi unuttum
          </button>
        )}

        {needToken && (
          <div className="mb-4 flex justify-center">
            <TurnstileWidget siteKey={siteKey} onVerify={setToken} />
          </div>
        )}

        {error && <p className="text-animen-red text-sm mb-3">{error}</p>}
        {info && <p className="text-green-400 text-sm mb-3">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-md btn-primary text-white font-semibold disabled:opacity-50"
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
