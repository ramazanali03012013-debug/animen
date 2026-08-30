"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileFormProps {
  userId: string;
  email: string;
  verified: boolean;
  defaultUsername?: string;
  defaultAvatar?: string;
}

export function ProfileForm({
  userId,
  email,
  verified,
  defaultUsername = "",
  defaultAvatar = "",
}: ProfileFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(defaultUsername);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, username: username || null, avatar_url: avatar || null });
      if (error) setErr(error.message);
      else {
        setMsg("Profil güncellendi.");
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="glass border border-animen-gray rounded-2xl p-6 fade-in">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-white font-semibold">{email}</span>
        {verified ? (
          <span className="px-2 py-0.5 text-xs rounded bg-green-600/20 text-green-400 border border-green-600/40">
            E-posta doğrulanmış
          </span>
        ) : (
          <span className="px-2 py-0.5 text-xs rounded bg-animen-red/20 text-animen-red border border-animen-red/40">
            E-posta doğrulanmamış
          </span>
        )}
      </div>

      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Kullanıcı adı</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md bg-animen-black border border-animen-gray px-3 py-2 text-white focus:outline-none focus:border-animen-red"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Avatar URL</label>
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-md bg-animen-black border border-animen-gray px-3 py-2 text-white focus:outline-none focus:border-animen-red"
          />
        </div>
        {err && <p className="text-animen-red text-sm">{err}</p>}
        {msg && <p className="text-green-400 text-sm">{msg}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-5 py-2 rounded-md btn-primary text-white font-semibold disabled:opacity-50">
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button type="button" onClick={signOut} className="px-5 py-2 rounded-md border border-animen-gray text-white hover:border-animen-red">
            Çıkış Yap
          </button>
        </div>
      </form>
    </div>
  );
}
