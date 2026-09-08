import React, { useState } from "react";
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

interface LoginScreenProps {
  onContinueWithEmail: (email: string) => void;
  onContinueWithGoogle: () => void;
  onContinueWithMicrosoft: () => void;
  onNavigateToSignUp: () => void;
  theme?: ThemeMode;
  initialEmail?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onContinueWithEmail,
  onContinueWithGoogle,
  onContinueWithMicrosoft,
  onNavigateToSignUp,
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

    // Basic email validation regex
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
      className={`w-full h-full flex flex-col justify-between px-6 sm:px-8 py-6 transition-colors duration-200 select-none overflow-y-auto ${
        isLight ? "bg-white text-[#0f172a]" : "bg-[#0f1216] text-white"
      }`}
    >
      {/* Top Spacer & Header */}
      <div className="flex flex-col items-center pt-2 sm:pt-4">
        {/* Clockify Logo */}
        <ClockifyLogo theme={theme} />

        {/* Title */}
        <h1
          className={`mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-center ${
            isLight ? "text-[#0f172a]" : "text-white"
          }`}
        >
          Log in
        </h1>
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

        {/* Switch to Sign Up */}
        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs sm:text-sm">
          <span className={isLight ? "text-[#64748b]" : "text-[#8c9ba5]"}>
            Don&apos;t have an account?
          </span>
          <button
            type="button"
            onClick={onNavigateToSignUp}
            className="text-[#00b0ff] hover:text-[#009ee6] font-semibold transition-colors cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>

      {/* cake.com PRODUCTIVITY SUITE footer */}
      <CakeFooter theme={theme} />
    </div>
  );
};
