"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { LuEye, LuEyeOff, LuLock, LuMail, LuShieldCheck } from "react-icons/lu";
import navlogo from "../../assets/navlogo.svg";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Invalid credentials. Please contact your administrator.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0814] text-text-primary px-4 py-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#6c5ce7]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-secondary/90 backdrop-blur-xl border border-gray-700/60 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 transition-all">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 flex items-center justify-center">
            <Image
              src={navlogo}
              alt="DailyDocket"
              width={180}
              height={45}
              priority
              className="h-auto w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Sign in with the account provided by your administrator
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start space-x-2">
            <span className="font-semibold">⚠️</span>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <LuMail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-11 pl-10 pr-4 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors text-sm"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <LuLock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-11 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-11 mt-2 flex items-center justify-center font-medium rounded-lg text-white transition-all text-sm ${
              loading
                ? "bg-accent/60 cursor-not-allowed"
                : "bg-accent hover:bg-accent/90 cursor-pointer shadow-lg shadow-accent/25 active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Administrator access notice */}
        <div className="mt-6 pt-5 border-t border-gray-700/60 text-xs text-gray-400 space-y-2">
          <div className="flex items-center space-x-2 text-gray-300">
            <LuShieldCheck size={16} className="text-accent flex-shrink-0" />
            <span className="font-medium">Role-Based System Access</span>
          </div>
          <p className="leading-relaxed">
            Accounts are provisioned and managed by your organization&apos;s Administrator under User Management.
          </p>
        </div>
      </div>
    </div>
  );
}
