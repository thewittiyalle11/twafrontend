'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@twa/api-client';
import { loginSchema, type LoginInput } from '@twa/shared';
import { useAuthStore } from '@/lib/stores';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    const result = await login.mutateAsync(data);
    setAuth(result.user, result.accessToken);
    router.push('/');
  };

  return (
    <div className="container-page py-20">
      <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Login</p>
          <h1 className="text-3xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-600">Sign in to access your orders, wishlist and faster checkout.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
            />
            {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
            />
            {errors.password && <p className="mt-2 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={login.isLoading}>
            {login.isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
