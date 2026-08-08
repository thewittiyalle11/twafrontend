'use client';

import { useAbout } from '@twa/api-client';

export default function AboutPage() {
  const aboutQuery = useAbout();

  return (
    <div className="container-page py-16">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-700">About Us</p>
        <h1 className="section-title">Our story</h1>
        <p className="max-w-3xl text-sm text-gray-600">
          Discover how TWA Fashion blends Indian craftsmanship with modern design for everyday wardrobe essentials.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Our mission</h2>
            <p className="mt-4 text-sm leading-7 text-gray-600">{aboutQuery.data?.mission}</p>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">What we believe in</h2>
            <p className="mt-4 text-sm leading-7 text-gray-600">{aboutQuery.data?.brandStory}</p>
          </section>
        </div>

        <div className="space-y-6">
          {aboutQuery.data?.team.map((member) => (
            <div key={member.name} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <img src={member.imageUrl} alt={member.name} className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
