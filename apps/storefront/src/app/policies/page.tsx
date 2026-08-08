'use client';

import { usePolicies } from '@twa/api-client';

export default function PoliciesPage() {
  const policiesQuery = usePolicies();

  return (
    <div className="container-page py-16">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Policies</p>
        <h1 className="section-title">Store policies</h1>
        <p className="text-sm text-gray-600">
          Read our shipping, returns, and privacy policies to know how your order is handled from checkout to delivery.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {policiesQuery.data?.map((policy) => (
          <section key={policy.id} className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">{policy.title}</h2>
            <p className="mt-4 text-sm leading-7 text-gray-600">{policy.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
