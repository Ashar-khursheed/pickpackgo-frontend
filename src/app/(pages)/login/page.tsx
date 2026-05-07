'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/assets/logo.svg';
import ModalAuthForm from '@/layouts/auth/auth-form';

const LoginPage = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-[#0d1637] px-6 py-4">
        <Link href="/">
          <Image src={Logo} alt="PikPakGo Logo" className="w-28 h-auto" priority />
        </Link>
      </div>

      {/* Form area */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-[#0d1637] mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-emerald-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>

          <ModalAuthForm
            mode="login"
            onSuccess={handleSuccess}
            onToggleMode={() => router.push('/signup')}
          />
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
