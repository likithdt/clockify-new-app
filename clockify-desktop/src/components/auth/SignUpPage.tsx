import React, { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { GoogleOAuthModal } from "./GoogleOAuthModal";
import { MicrosoftOAuthModal } from "./MicrosoftOAuthModal";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export const SignUpPage: React.FC = () => {
  const {
    setAuthView,
    signup,
    loginWithOAuth,
    isLoading,
    error,
    clearError,
    successToast,
    isGoogleModalOpen,
    openGoogleModal,
    closeGoogleModal,
    isMicrosoftModalOpen,
    openMicrosoftModal,
    closeMicrosoftModal,
  } = useAuthStore();

  const [name, setName] = useState("Bindhu shree");
  const [email, setEmail] = useState("sbindhu230@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setFormError("Please enter your name");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setFormError("Please enter a valid email address");
      return;
    }
    if (!termsAccepted) {
      setFormError("You must agree to the Terms of Use to proceed");
      return;
    }

    setFormError(null);
    clearError();
    await signup(cleanName, cleanEmail, password, termsAccepted);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fa] flex flex-col justify-between py-8 px-4 font-sans select-none overflow-y-auto">
      {/* Top Header with Clockify Brand */}
      <div className="w-full flex justify-center items-center pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#03a9f4] flex items-center justify-center text-white shadow-sm">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <span className="font-bold text-[#1e293b] text-2xl tracking-tight lowercase">
            clockify
          </span>
        </div>
      </div>

      {/* Main Sign Up Card */}
      <div className="w-full max-w-[460px] mx-auto bg-white rounded-2xl border border-[#e2e8f0] shadow-xl p-8 my-6">
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight text-center">
          Get started with Clockify
        </h1>
        <p className="text-xs text-[#64748b] text-center mt-1">
          Free time tracking software for teams and freelancers.
        </p>

        {/* Global Error Banner */}
        {(error || formError) && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError || error}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successToast && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Social Login Options */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={openGoogleModal}
            className="w-full h-11 px-4 rounded-xl border border-[#cbd5e1] hover:bg-[#f8fafc] hover:border-[#94a3b8] text-[#1e293b] text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer active:scale-[0.99]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          <button
            type="button"
            onClick={openMicrosoftModal}
            className="w-full h-11 px-4 rounded-xl border border-[#cbd5e1] hover:bg-[#f8fafc] hover:border-[#94a3b8] text-[#1e293b] text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer active:scale-[0.99]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
            <span>Sign up with Microsoft</span>
          </button>
        </div>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="w-full border-t border-[#e2e8f0]" />
          <span className="absolute px-3 bg-white text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
            OR
          </span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#475569] block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="e.g. Bindhu shree"
              className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#03a9f4] focus:ring-2 focus:ring-[#03a9f4]/20 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#475569] block mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="name@company.com"
              className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#03a9f4] focus:ring-2 focus:ring-[#03a9f4]/20 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#475569] block mb-1.5">
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a secure password"
                className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-[#cbd5e1] text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#03a9f4] focus:ring-2 focus:ring-[#03a9f4]/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] p-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-[#03a9f4] focus:ring-[#03a9f4] border-[#cbd5e1] cursor-pointer"
            />
            <label
              htmlFor="termsAccepted"
              className="text-xs text-[#64748b] leading-tight cursor-pointer select-none"
            >
              I agree to the{" "}
              <span className="text-[#03a9f4] hover:underline">Terms of Use</span> and{" "}
              <span className="text-[#03a9f4] hover:underline">Privacy Policy</span>.
            </label>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading || !email.trim() || !name.trim()}
            className="w-full h-11 rounded-xl bg-[#03a9f4] hover:bg-[#0288d1] active:scale-[0.99] text-white text-sm font-bold shadow-md shadow-[#03a9f4]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Create free account</span>
            )}
          </button>
        </form>

        {/* Switch to Log in */}
        <div className="mt-6 pt-5 border-t border-[#f1f5f9] text-center text-xs text-[#64748b]">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={() => setAuthView("login")}
            className="text-[#03a9f4] hover:underline font-bold transition-colors cursor-pointer"
          >
            Log in
          </button>
        </div>
      </div>

      {/* cake.com PRODUCTIVITY SUITE Footer */}
      <footer className="w-full flex flex-col items-center justify-center pb-2 select-none">
        <div className="flex items-center text-lg font-bold tracking-tight text-[#1e293b]">
          <span>cake</span>
          <span className="text-[#03a9f4]">.</span>
          <span>com</span>
        </div>
        <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#94a3b8] mt-0.5">
          PRODUCTIVITY SUITE
        </span>
      </footer>

      {/* OAuth Modals */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={closeGoogleModal}
        onSelectAccount={(account) => {
          loginWithOAuth("google", account.email, account.name, account.initials);
        }}
      />

      <MicrosoftOAuthModal
        isOpen={isMicrosoftModalOpen}
        onClose={closeMicrosoftModal}
        onSelectAccount={(account) => {
          loginWithOAuth("microsoft", account.email, account.name, account.initials);
        }}
      />
    </div>
  );
};

export default SignUpPage;
