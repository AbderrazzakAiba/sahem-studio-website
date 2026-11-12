import type { Locale } from "@/lib/i18n";

/**
 * Words of the 404 page (handoff 404 screens). Kept apart from the dictionaries because the not-found page
 * picks its language in the browser (from the URL) and should not ship the whole dictionary.
 */
export const notFoundCopy: Record<
  Locale,
  {
    title: string;
    eyebrow: string;
    latin: string;
    heading: string;
    lead: string;
    home: string;
    linksLabel: string;
    links: { services: string; work: string; process: string; start: string };
  }
> = {
  ar: {
    title: "الصفحة غير موجودة",
    eyebrow: "404",
    latin: "PAGE NOT FOUND",
    heading: "ضللتَ الطريق؟",
    lead: "هذه الصفحة غير موجودة، أو تغيّر عنوانها. لنعدك إلى المسار.",
    home: "العودة إلى الرئيسية",
    linksLabel: "روابط مفيدة",
    links: { services: "الخدمات", work: "الأعمال", process: "طريقتنا", start: "ابدأ مشروعك" },
  },
  en: {
    title: "Page not found",
    eyebrow: "404 · Page not found",
    latin: "",
    heading: "Lost your way?",
    lead: "This page doesn’t exist, or its address has changed. Let’s get you back on the route.",
    home: "Back to the home page",
    linksLabel: "Useful links",
    links: { services: "Services", work: "Work", process: "Process", start: "Start your project" },
  },
  fr: {
    title: "Page introuvable",
    eyebrow: "404 · Page introuvable",
    latin: "",
    heading: "Vous vous êtes égaré ?",
    lead: "Cette page n’existe pas, ou son adresse a changé. Revenons sur la route.",
    home: "Retour à l’accueil",
    linksLabel: "Liens utiles",
    links: { services: "Services", work: "Réalisations", process: "Méthode", start: "Lancer votre projet" },
  },
};
