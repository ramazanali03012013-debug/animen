import Image from "next/image";
import Link from "next/link";

interface MediaCardProps {
  title: string;
  image: string;
  href: string;
  subtitle?: string;
  badge?: string;
}

export function MediaCard({ title, image, href, subtitle, badge }: MediaCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-animen-dark hover-scale">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 40vw, 200px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-animen-light/30 text-xs">
            Görsel yok
          </div>
        )}
        {badge && (
          <span className="absolute top-2 left-2 bg-animen-red text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {badge}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
          <span className="text-white text-xs font-medium line-clamp-2">{subtitle || title}</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-animen-light/90 line-clamp-2 group-hover:text-animen-red transition">
        {title}
      </p>
    </Link>
  );
}
