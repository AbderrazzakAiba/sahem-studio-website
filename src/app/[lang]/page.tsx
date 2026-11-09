import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

/**
 * Home — placeholder only. The real page is the next Trello task («برمجة الصفحة الرئيسية»),
 * built from the handoff screens home-desktop / home-tablet / home-mobile.
 */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <main id="main" className="grid min-h-dvh place-items-center px-6">
      <h1 className="text-ar-h2 [:lang(en)_&]:text-en-h2 [:lang(fr)_&]:text-en-h2">{t.site.name}</h1>
    </main>
  );
}
