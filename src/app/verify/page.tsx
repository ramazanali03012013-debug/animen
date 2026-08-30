import { env } from "@/lib/env";

import { ChallengeWrapper } from "@/components/Challenge";

export default function VerifyPage() {
  return <ChallengeWrapper siteKey={env.turnstileSiteKey} />;
}
