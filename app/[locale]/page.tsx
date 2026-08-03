import { setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/sections/Hero';
import { Manifesto } from '@/components/sections/Manifesto';
import { Expertise } from '@/components/sections/Expertise';
import { Rbac } from '@/components/sections/Rbac';
import { Concurrency } from '@/components/sections/Concurrency';
import { Experience } from '@/components/sections/Experience';
import { Work } from '@/components/sections/Work';
import { Stack } from '@/components/sections/Stack';
import { Contact } from '@/components/sections/Contact';
import { Faq } from '@/components/sections/Faq';
import { NotesTeaser } from '@/components/sections/NotesTeaser';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <main id="main-content">
        <Hero />
        <Manifesto />
        <Expertise />
        {/* The two demos sit back to back: isolation first, then the
            conflict it cannot prevent on its own. */}
        <Rbac />
        <Concurrency />
        <Experience />
        <Work />
        <Stack />
        <NotesTeaser />
        <Faq />
        <Contact />
      </main>
      <FaqJsonLd />
    </>
  );
}
