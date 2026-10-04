"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

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
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-sm text-gray-700"
            >
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              autoFocus
              autoComplete="name"
              className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Email Address */}
          <div className="mt-4">
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
              autoComplete="new-password"
              className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-4">
            <label
              htmlFor="password_confirmation"
              className="block font-medium text-sm text-gray-700"
            >
              Konfirmasi Password
            </label>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              required
              autoComplete="new-password"
              className="block mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <Link
              href="/login"
              className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md"
            >
              Already registered?
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors shadow text-sm"
            >
              {isPending ? "Mendaftar..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
