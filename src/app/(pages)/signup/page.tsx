'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/assets/logo.svg';
import ModalAuthForm from '@/layouts/auth/auth-form';

const SignupPage = () => {
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
          <h1 className="text-2xl font-bold text-[#0d1637] mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 mb-6">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 font-medium hover:underline">
              Log in
            </Link>
          </p>

          <ModalAuthForm
            mode="signup"
            onSuccess={handleSuccess}
            onToggleMode={() => router.push('/login')}
          />
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
