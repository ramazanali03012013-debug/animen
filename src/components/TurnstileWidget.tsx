"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
  theme?: "light" | "dark";
}

export function TurnstileWidget({ siteKey, onVerify, theme = "dark" }: TurnstileWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "cf-turnstile-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      document.body.appendChild(script);
    }

    let widgetId: string | undefined;
    const tryRender = () => {
      if (window.turnstile && ref.current) {
        widgetId = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          theme,
          callback: (token: string) => onVerify(token),
        });
      } else {
        setTimeout(tryRender, 200);
      }
    };
    tryRender();

    return () => {
      if (widgetId) window.turnstile?.reset(widgetId);
    };
  }, [siteKey, onVerify, theme]);

  return <div ref={ref} />;
}
