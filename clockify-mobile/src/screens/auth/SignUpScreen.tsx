import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  ClockifyLogo,
  GoogleIcon,
  MicrosoftIcon,
  SocialButton,
  OrDivider,
  FloatingEmailInput,
  EmailContinueButton,
  CakeFooter,
} from "./AuthComponents";
import { ThemeMode } from "@/stores/useAuthStore";

interface SignUpScreenProps {
  onContinueWithEmail: (email: string) => void;
  onContinueWithGoogle: () => void;
  onContinueWithMicrosoft: () => void;
  onNavigateToLogin: () => void;
  onBack?: () => void;
  theme?: ThemeMode;
  initialEmail?: string;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onContinueWithEmail,
  onContinueWithGoogle,
  onContinueWithMicrosoft,
  onNavigateToLogin,
  onBack,
  theme = "light",
  initialEmail = "",
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLight = theme === "light";

  const handleEmailSubmit = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onContinueWithEmail(trimmed);
    }, 300);
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-between px-6 sm:px-8 py-6 transition-colors duration-200 select-none overflow-y-auto relative ${
        isLight ? "bg-white text-[#0f172a]" : "bg-[#0f1216] text-white"
      }`}
    >
      {/* Top Header with Back Arrow */}
      <div className="relative pt-1 sm:pt-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className={`absolute left-0 top-1 p-1.5 rounded-full transition-colors cursor-pointer ${
              isLight
                ? "text-[#0f172a] hover:bg-slate-100"
                : "text-white hover:bg-white/10"
            }`}
            title="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}

        {/* Clockify Logo */}
        <div className="flex flex-col items-center pt-3">
          <ClockifyLogo theme={theme} />

          {/* Title: Get started with Clockify */}
          <h1
            className={`mt-4 text-xl sm:text-2xl font-bold tracking-tight text-center ${
              isLight ? "text-[#0f172a]" : "text-white"
            }`}
          >
            Get started with Clockify
          </h1>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex flex-col gap-3.5 my-auto max-w-[360px] w-full mx-auto py-4">
        {/* Continue with Google */}
        <SocialButton
          icon={<GoogleIcon />}
          label="Continue with Google"
          onClick={onContinueWithGoogle}
          theme={theme}
        />

        {/* Continue with Microsoft */}
        <SocialButton
          icon={<MicrosoftIcon />}
          label="Continue with Microsoft"
          onClick={onContinueWithMicrosoft}
          theme={theme}
        />

        {/* OR Divider */}
        <OrDivider theme={theme} />

        {/* Floating Email Input */}
        <FloatingEmailInput
          value={email}
          onChange={(val) => {
            setEmail(val);
            if (error) setError(null);
          }}
          onSubmit={handleEmailSubmit}
          theme={theme}
          error={error || undefined}
        />

        {/* Continue with Email Button */}
        <EmailContinueButton
          onClick={handleEmailSubmit}
          disabled={!email.trim()}
          loading={isLoading}
          theme={theme}
        />

        {/* Switch to Log in */}
        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs sm:text-sm">
          <span className={isLight ? "text-[#64748b]" : "text-[#8c9ba5]"}>
            Already have an account?
          </span>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="text-[#00b0ff] hover:text-[#009ee6] font-semibold transition-colors cursor-pointer"
          >
            Log in
          </button>
        </div>
      </div>

      {/* cake.com PRODUCTIVITY SUITE footer */}
      <CakeFooter theme={theme} />
    </div>
  );
};
