export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated from the page's own visible content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
