import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import type { featuredWork } from "@/content/home";
import type { Dictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";

type Props = {
  work: (typeof featuredWork)[number];
  /** Position shown as "01", "02"… */
  index: number;
  /** Project names, results, alt text and tag labels. */
  t: Pick<Dictionary["home"]["work"], "items" | "tags">;
  locale: Locale;
};

/**
 * A project card (handoff Work / Related work): 4:3 image in a frame, name + number, tags, result in words.
 * The whole card is one link (to the case study once it exists, else to /work). Hover: the image scales 1.03
 * inside its frame (M-14). Used on the home gallery and the service pages; inside the Ink section the colours
 * flip through the tokens.
 */
export function WorkCard({ work, index, t, locale }: Props) {
  const copy = t.items[work.id];
  return (
    <Link
      href={localizedPath(work.slug ? `/work/${work.slug}` : "/work", locale)}
      draggable={false}
      className="group/work flex flex-col gap-3 lg:gap-4"
    >
      <div className="aspect-[4/3] overflow-hidden border border-border-subtle bg-bg-raised transition-colors duration-[var(--duration-instant)] group-hover/work:border-border-control">
        <Image
          src={work.image}
          alt={copy.alt}
          draggable={false}
          width={1200}
          height={900}
          unoptimized
          className="size-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-route)] group-hover/work:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-card-title">{copy.client}</h3>
        <span className="text-index text-text-secondary">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 lg:gap-2">
        {work.tags.map((tag) => (
          <Tag key={tag} className="min-h-7 border-border-control px-2.5 lg:min-h-[30px] lg:px-3">
            {t.tags[tag]}
          </Tag>
        ))}
      </div>
      <p className="text-[15px] leading-[1.6] text-text-secondary">{copy.result}</p>
    </Link>
  );
}
