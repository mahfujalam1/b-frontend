'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalculator, FaLock, FaEnvelope } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginAction } from '@/actions/auth';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginAction(data);
      if (res.success) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 rounded-3xl space-y-8"
      >
        <div className="text-center">
          <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
            <FaCalculator size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Hisab Nikash Pro</h1>
          <p className="text-muted-foreground mt-2">Welcome back, Partner</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                className="w-full bg-secondary/50 border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-medium">Password</label>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => alert('Password reset link sent to your email (Demo)')}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full bg-secondary/50 border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>Don't have an account? Contact Admin</p>
        </div>
      </motion.div>
    </div>
  );
}
