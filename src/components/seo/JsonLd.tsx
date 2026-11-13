/**
 * Structured data for search engines (schema.org JSON-LD), as the Next.js docs recommend: a script tag in the
 * page. `<` is escaped so no text from the content (a dictionary, later a CMS) can close the tag and inject
 * HTML. Server-only content: renders nothing visible.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
