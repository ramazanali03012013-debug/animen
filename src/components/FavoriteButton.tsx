"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FavoriteButtonProps {
  kind: "anime" | "manga";
  refId: string;
  title: string;
  image: string;
}

export function FavoriteButton({ kind, refId, title, image }: FavoriteButtonProps) {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/giris");
        return;
      }
      if (done) {
        await supabase.from("favorites").delete().match({ user_id: user.id, kind, ref_id: refId });
        setDone(false);
      } else {
        await supabase
          .from("favorites")
          .upsert({ user_id: user.id, kind, ref_id: refId, title, image });
        setDone(true);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`px-4 py-2.5 rounded-md border text-sm font-semibold transition ${
        done
          ? "border-animen-red bg-animen-red/20 text-animen-red"
          : "border-animen-gray text-white hover:border-animen-red"
      }`}
    >
      {done ? "★ Favorilerde" : "☆ Favorilere Ekle"}
    </button>
  );
}
