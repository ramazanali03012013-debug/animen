import { AuthForm } from "@/components/AuthForm";
import { env } from "@/lib/env";

export default function LoginPage() {
  return <AuthForm mode="login" siteKey={env.turnstileSiteKey} />;
}
