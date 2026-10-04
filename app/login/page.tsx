"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 px-4">
      <div>
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="SB Jaya Logo"
            width={240}
            height={60}
            className="w-64 h-auto"
            priority
          />
        </Link>
      </div>

      <div className="w-full sm:max-w-md mt-6 px-6 py-6 bg-white shadow-md overflow-hidden sm:rounded-lg border border-gray-100">
        {state?.error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md">
            {state.error}
          </div>
        )}

        <form action={formAction}>
          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-sm text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoFocus
              autoComplete="username"
              className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block font-medium text-sm text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Remember Me */}
          <div className="block mt-4">
            <label htmlFor="remember_me" className="inline-flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                name="remember"
                className="rounded border-gray-300 text-red-600 shadow-sm focus:ring-red-500 h-4 w-4"
              />
              <span className="ms-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          {/* Links */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-400">Toko SB Jaya</span>
            <Link
              href="/register"
              className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md"
            >
              Don&apos;t have an account?
            </Link>
          </div>

          {/* Tombol Login */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isPending}
              className="w-full justify-center py-3 text-base bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors shadow flex items-center"
            >
              {isPending ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>

        {/* Demo Accounts Helper */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p className="font-semibold text-gray-700 mb-1">Akun Akses:</p>
          <p>Kasir: <span className="font-mono text-gray-800">kasir@sbjaya.com</span> / pass: password</p>
          <p>Gudang: <span className="font-mono text-gray-800">gudang@sbjaya.com</span> / pass: password</p>
        </div>
      </div>
    </div>
  );
}
