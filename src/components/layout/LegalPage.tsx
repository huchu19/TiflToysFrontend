import PageHeader from './PageHeader';

export type LegalSection = { heading: string; body: string };

// Shared layout for the legal/policy pages (refunds, terms, privacy).
export default function LegalPage({
  title,
  updated,
  intro,
  sections,
  draft = false,
}: {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
  /** Show a "needs review" banner. Leave off once copy is owner-approved. */
  draft?: boolean;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <PageHeader title={title} />

      <p className="mt-6 text-center text-sm text-gray-400">Last updated: {updated}</p>
      {draft && (
        <div className="mx-auto mt-4 max-w-xl rounded-xl bg-bg-yellow/50 px-4 py-3 text-center text-xs text-gray-600">
          Draft policy — replace with your reviewed legal copy before launch.
        </div>
      )}

      <div className="mt-10 space-y-8">
        {intro ? <p className="leading-relaxed text-gray-600">{intro}</p> : null}
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-fredoka text-xl font-bold text-brand-purple">{s.heading}</h2>
            <p className="mt-2 leading-relaxed text-gray-600">{s.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
