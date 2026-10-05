'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContact } from '@twa/api-client';
import { contactSchema, type ContactInput } from '@twa/shared';

export default function ContactPage() {
  const contact = useContact();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    await contact.mutateAsync(data);
    reset();
  };

  return (
    <div className="container-page py-16">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Contact Us</p>
        <h1 className="section-title">Get in touch</h1>
        <p className="text-sm text-gray-600">
          Have a question about your order or need help choosing styles? Send us a message and our team will respond shortly.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Name</label>
            <input
              {...register('name')}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
            />
            {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
            />
            {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Message</label>
            <textarea
              {...register('message')}
              rows={6}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
            />
            {errors.message && <p className="mt-2 text-xs text-red-600">{errors.message.message}</p>}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={contact.isPending}>
            {contact.isPending ? 'Sending...' : 'Send message'}
          </button>
          {contact.isSuccess && <p className="text-sm text-green-600">Thank you! We will reply soon.</p>}
        </form>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Contact details</h2>
          <div className="mt-6 space-y-4 text-sm text-gray-600">
            <p>hello@twafashion.in</p>
            <p>+91 98765 43210</p>
            <p>42, Palm Grove Apartments, Mumbai, Maharashtra</p>
          </div>
        </div>
      </div>
    </div>
  );
}
