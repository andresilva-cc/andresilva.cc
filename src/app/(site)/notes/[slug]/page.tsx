import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { ArrowLink } from '@/components/arrow-link';
import { NoteBlock } from '@/components/note-block';
import { getRepositories } from '@/repositories';
import { SITE_ORIGIN } from '@/lib/config';

export async function generateStaticParams() {
  const { notesRepository } = getRepositories();
  return notesRepository.getAll().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { notesRepository } = getRepositories();
  const note = notesRepository.getBySlug(slug);
  if (!note) return {};
  return {
    title: `${note.title} · André Silva`,
    alternates: {
      canonical: `${SITE_ORIGIN}/notes/${note.slug}`,
    },
    openGraph: {
      title: note.title,
      type: 'article',
      publishedTime: note.publishedAt,
      url: `${SITE_ORIGIN}/notes/${note.slug}`,
      images: [{ url: `${SITE_ORIGIN}${note.ogImage}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: note.title,
      images: [`${SITE_ORIGIN}${note.ogImage}`],
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { notesRepository } = getRepositories();
  const note = notesRepository.getBySlug(slug);
  if (!note) notFound();

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': note.title,
    'datePublished': note.publishedAt,
    'author': { '@type': 'Person', 'name': 'André Silva', 'url': `${SITE_ORIGIN}/about` },
    'url': `${SITE_ORIGIN}/notes/${note.slug}`,
    'image': `${SITE_ORIGIN}${note.ogImage}`,
    'inLanguage': 'en',
    'isPartOf': { '@type': 'Blog', 'name': 'andresilva.cc/notes' },
  };

  return (
    <article>
      <div className="pt-8">
        <ArrowLink href="/notes" direction="back">back to notes</ArrowLink>
      </div>

      <div className="mt-8">
        <NoteBlock note={note} surface="detail" />
      </div>

      <div className="mt-8 pb-12">
        <ArrowLink href="/notes" direction="back">back to notes</ArrowLink>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/<\/script>/gi, '<\\/script>') }}
      />
    </article>
  );
}
