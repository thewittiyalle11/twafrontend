"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@twa/api-client';
import { registerSchema, type RegisterFormData } from '@twa/shared';
import { useAuthStore } from '@/lib/stores';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const registerMut = useRegister();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerMut.mutateAsync(data as any);
    setAuth(result.user, result.accessToken);
    router.push('/');
  };

  return (
    <div className="container-page py-20">
      <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Register</p>
          <h1 className="text-3xl font-semibold text-gray-900">Create an account</h1>
          <p className="text-sm text-gray-600">Enter your details to create a new account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Name</label>
            <input {...register('name')} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700" />
            {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Email</label>
            <input {...register('email')} type="email" className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700" />
            {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Password</label>
            <input {...register('password')} type="password" className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700" />
            {errors.password && <p className="mt-2 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Phone</label>
            <input {...register('phone')} type="tel" className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700" />
            {errors.phone && <p className="mt-2 text-xs text-red-600">{errors.phone.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={registerMut.isLoading}>
            {registerMut.isLoading ? 'Registering...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
