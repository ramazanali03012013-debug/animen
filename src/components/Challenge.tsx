"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { TurnstileWidget } from "./TurnstileWidget";

export function Challenge({ siteKey }: { siteKey: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [status, setStatus] = useState<"idle" | "verifying" | "ok" | "err">("idle");

  async function verify(token?: string) {
    setStatus("verifying");
    const res = await fetch("/api/verify-turnstile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: token ?? "" }),
    });
    if (res.ok) {
      setStatus("ok");
      router.replace(next);
    } else {
      setStatus("err");
    }
  }

  useEffect(() => {
    if (!siteKey) verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold mb-2">
        <span className="text-animen-red">Ani</span>men
      </h1>
      <p className="text-animen-light/70 mb-6 max-w-sm">
        Devam etmeden önce insan olduğunuzu doğrulamamız gerekiyor. Bu, sitemizi
        bot saldırılarına karşı korur.
      </p>
      {siteKey ? (
        <TurnstileWidget siteKey={siteKey} onVerify={(token) => verify(token)} />
      ) : (
        <p className="text-sm text-animen-light/50">Doğrulanıyor...</p>
      )}
      {status === "verifying" && <p className="mt-4 text-sm text-animen-light/50">Lütfen bekleyin...</p>}
      {status === "err" && (
        <p className="mt-4 text-sm text-animen-red">Doğrulama başarısız oldu. Sayfayı yenileyin.</p>
      )}
    </div>
  );
}

export function ChallengeWrapper({ siteKey }: { siteKey: string }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Yükleniyor...</div>}>
      <Challenge siteKey={siteKey} />
    </Suspense>
  );
}
