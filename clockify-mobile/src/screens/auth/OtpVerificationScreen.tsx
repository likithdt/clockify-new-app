import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ClockifyLogo, CakeFooter } from "./AuthComponents";
import { ThemeMode } from "@/stores/useAuthStore";

interface OtpVerificationScreenProps {
  email: string;
  onVerifyOtp: (code: string) => void;
  onBack: () => void;
  onResendCode?: () => void;
  theme?: ThemeMode;
}

export const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  email,
  onVerifyOtp,
  onBack,
  onResendCode,
  theme = "light",
}) => {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [resendCooldown, setResendCooldown] = useState<number>(30);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isLight = theme === "light";

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Focus the active input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle single digit input
  const handleChange = (index: number, val: string) => {
    if (error) setError(null);

    // Filter only digits
    const cleaned = val.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    const next = [...digits];
    // Take the last entered character if multiple typed
    next[index] = cleaned[cleaned.length - 1];
    setDigits(next);

    // Auto-advance to next input
    if (index < 5) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    } else {
      // Check if all filled
      const fullCode = next.join("");
      if (fullCode.length === 6) {
        submitCode(fullCode);
      }
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move to previous box
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
        setFocusedIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste for full 6 digits
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const next = [...digits];
    for (let i = 0; i < pastedData.length; i++) {
      next[i] = pastedData[i];
    }
    setDigits(next);

    if (pastedData.length === 6) {
      setFocusedIndex(5);
      inputRefs.current[5]?.focus();
      submitCode(pastedData);
    } else {
      const nextIdx = Math.min(pastedData.length, 5);
      setFocusedIndex(nextIdx);
      inputRefs.current[nextIdx]?.focus();
    }
  };

  const submitCode = (code: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setTimeout(() => {
        onVerifyOtp(code);
      }, 600);
    }, 600);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    setResendMessage("Code resent successfully!");
    onResendCode?.();
    setTimeout(() => setResendMessage(null), 4000);
  };

  const handleOpenMail = () => {
    // Open default mail client or browser webmail
    window.location.href = `mailto:${email}`;
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-between px-6 sm:px-8 py-6 transition-colors duration-200 select-none overflow-y-auto relative ${
        isLight ? "bg-white text-[#0f172a]" : "bg-[#0f1216] text-white"
      }`}
    >
      {/* Top Header with Back Arrow */}
      <div className="relative pt-1 sm:pt-2">
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

        {/* Clockify Logo */}
        <div className="flex flex-col items-center pt-3">
          <ClockifyLogo theme={theme} />

          {/* Title: Check your email */}
          <h1
            className={`mt-4 text-xl sm:text-2xl font-bold tracking-tight text-center ${
              isLight ? "text-[#0f172a]" : "text-white"
            }`}
          >
            Check your email
          </h1>

          {/* Subtitle instructions matching screenshot */}
          <div
            className={`mt-2 text-xs sm:text-sm text-center leading-relaxed ${
              isLight ? "text-[#475569]" : "text-[#8c9ba5]"
            }`}
          >
            <p>
              We sent a code to{" "}
              <span className={`font-semibold ${isLight ? "text-[#0f172a]" : "text-white"}`}>
                {email || "your email"}
              </span>
            </p>
            <p className="mt-0.5">Please type or paste it below.</p>
          </div>
        </div>
      </div>

      {/* Main Verification Block */}
      <div className="flex flex-col items-center gap-6 my-auto max-w-[360px] w-full mx-auto py-4">
        {/* 6 Digit Input Boxes */}
        <div className="flex items-center justify-between w-full gap-2 px-1">
          {digits.map((digit, index) => {
            const isCurrent = focusedIndex === index;
            return (
              <div key={index} className="relative flex-1 max-w-[48px]">
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  onFocus={() => setFocusedIndex(index)}
                  className={`w-full h-13 sm:h-14 rounded-xl border-2 text-center text-xl font-bold font-mono outline-none transition-all duration-150 ${
                    isCurrent
                      ? "border-[#00b0ff] ring-2 ring-[#00b0ff]/25 bg-transparent"
                      : digit
                      ? isLight
                        ? "border-[#94a3b8] bg-white text-[#0f172a]"
                        : "border-[#484f58] bg-[#161b22] text-white"
                      : isLight
                      ? "border-[#cbd5e1] bg-white text-[#0f172a]"
                      : "border-[#30363d] bg-[#161b22]/40 text-white"
                  } ${isLight ? "text-[#0f172a]" : "text-white"} caret-[#00b0ff]`}
                />
              </div>
            );
          })}
        </div>

        {/* Verification spinner or success indicator */}
        {isVerifying && (
          <div className="flex items-center gap-2 text-xs font-medium text-[#00b0ff]">
            <div className="w-3.5 h-3.5 border-2 border-[#00b0ff]/30 border-t-[#00b0ff] rounded-full animate-spin" />
            <span>Verifying code...</span>
          </div>
        )}

        {isVerified && (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified successfully! Entering app...</span>
          </div>
        )}

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        {resendMessage && (
          <p className="text-xs text-emerald-500 font-medium animate-fadeIn">
            {resendMessage}
          </p>
        )}

        {/* Help & Resend Email Section matching reference screenshot */}
        <div
          className={`text-xs sm:text-sm text-center leading-relaxed ${
            isLight ? "text-[#475569]" : "text-[#8c9ba5]"
          }`}
        >
          <p>Can&apos;t find your email? Check your spam or</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`font-medium transition-colors mt-0.5 cursor-pointer ${
              resendCooldown > 0
                ? isLight
                  ? "text-[#94a3b8] cursor-not-allowed"
                  : "text-[#6e7681] cursor-not-allowed"
                : "text-[#00b0ff] hover:underline"
            }`}
          >
            {resendCooldown > 0 ? `resend email in ${resendCooldown}s` : "resend email"}
          </button>
        </div>

        {/* Open Mail Pill Button matching reference screenshot */}
        <button
          type="button"
          onClick={handleOpenMail}
          className={`w-full max-w-[320px] h-12 rounded-full px-6 flex items-center justify-center text-sm font-medium transition-all duration-150 active:scale-[0.99] border cursor-pointer ${
            isLight
              ? "border-[#cbd5e1] bg-white text-[#1e293b] hover:bg-[#f8fafc] hover:border-[#94a3b8] shadow-xs"
              : "border-[#30363d] bg-transparent text-white hover:bg-white/5 hover:border-[#484f58]"
          }`}
        >
          Open mail
        </button>
      </div>

      {/* cake.com PRODUCTIVITY SUITE footer */}
      <CakeFooter theme={theme} />
    </div>
  );
};
