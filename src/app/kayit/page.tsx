import { AuthForm } from "@/components/AuthForm";
import { env } from "@/lib/env";

export default function RegisterPage() {
  return <AuthForm mode="register" siteKey={env.turnstileSiteKey} />;
}
