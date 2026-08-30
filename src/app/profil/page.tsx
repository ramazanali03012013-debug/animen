import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/ProfileForm";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: favorites } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">
        <span className="text-animen-red">Profil</span>im
      </h1>

      <ProfileForm
        userId={user.id}
        email={user.email ?? ""}
        verified={!!user.email_confirmed_at}
        defaultUsername={profile?.username ?? ""}
        defaultAvatar={profile?.avatar_url ?? ""}
      />

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3">Favorilerim</h2>
        {favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {favorites.map((f: { kind: string; ref_id: string; title?: string; image?: string }) => (
              <a
                key={`${f.kind}-${f.ref_id}`}
                href={`/${f.kind}/${f.ref_id}`}
                className="block rounded-md overflow-hidden border border-animen-gray hover-lift bg-animen-dark"
              >
                {f.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.image} alt={f.title ?? ""} className="w-full aspect-[2/3] object-cover" />
                ) : (
                  <div className="w-full aspect-[2/3] bg-animen-gray" />
                )}
                <p className="p-2 text-xs line-clamp-2">{f.title}</p>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-animen-light/50 text-sm">
            Henüz favori eklemedin. Anime/manga sayfalarından favorileyeceksin.
          </p>
        )}
      </section>
    </div>
  );
}
