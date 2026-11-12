import { Suspense } from "react";
import { LocalizedNotFound } from "@/components/sections/LocalizedNotFound";

/**
 * 404 for notFound() thrown by a page under [lang] (an unknown service or project…). Unknown addresses go to
 * app/global-not-found.tsx; both show the same page. Next.js adds <meta name="robots" content="noindex">.
 */
export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <LocalizedNotFound />
    </Suspense>
  );
}
