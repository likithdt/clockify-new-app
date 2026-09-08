import React, { forwardRef, useState } from "react";
import { Mail } from "lucide-react";
import { ThemeMode } from "@/stores/useAuthStore";

// Clockify Brand Logo with official cyan square + Clockify glyph
export const ClockifyLogo: React.FC<{ theme?: ThemeMode }> = ({ theme = "light" }) => {
  return (
    <div className="flex items-center gap-2.5 justify-center select-none">
      {/* Cyan rounded square with clock icon */}
      <div className="w-10 h-10 rounded-xl bg-[#00b0ff] flex items-center justify-center shadow-sm shrink-0">
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Clockify circular arc and hands */}
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.85-.51-3.58-1.39-5.07l-1.53.88C19.64 8.94 20 10.42 20 12c0 4.41-3.59 8-8 8s-8-3.59-8-8 3.59-8 8-8c1.58 0 3.06.46 4.31 1.25l.89-1.54C15.7 2.61 13.92 2 12 2zm-1 5v6h6v-2h-4V7h-2z" />
        </svg>
      </div>
      <span
        className={`text-2xl font-bold tracking-tight font-sans ${
          theme === "dark" ? "text-white" : "text-[#0f172a]"
        }`}
      >
        clockify
      </span>
    </div>
  );
};

// Google official 4-color 'G' icon
export const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 shrink-0" }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
);

// Microsoft official 4-squares icon
export const MicrosoftIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 shrink-0" }) => (
  <svg className={className} viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
  </svg>
);

// cake.com PRODUCTIVITY SUITE footer as seen in reference screenshots
export const CakeFooter: React.FC<{ theme?: ThemeMode }> = ({ theme = "light" }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-6 pb-4 select-none">
      <div
        className={`flex items-center text-xl font-bold tracking-tight ${
          theme === "dark" ? "text-[#e2e8f0]" : "text-[#1e293b]"
        }`}
      >
        <span>cake</span>
        <span className="text-[#00b0ff]">.</span>
        <span>com</span>
      </div>
      <span
        className={`text-[9px] font-bold tracking-[0.25em] uppercase mt-0.5 ${
          theme === "dark" ? "text-[#64748b]" : "text-[#94a3b8]"
        }`}
      >
        PRODUCTIVITY SUITE
      </span>
    </div>
  );
};

// Social Sign-In Pill Button
interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  theme?: ThemeMode;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  label,
  onClick,
  theme = "light",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-12 rounded-full px-5 flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.99] border ${
        theme === "dark"
          ? "border-[#30363d] bg-transparent text-[#e6edf3] hover:bg-white/5 hover:border-[#484f58]"
          : "border-[#cbd5e1] bg-white text-[#1e293b] hover:bg-[#f8fafc] hover:border-[#94a3b8] shadow-xs"
      }`}
    >
      {icon}
      <span className="text-sm font-medium tracking-normal">{label}</span>
    </button>
  );
};

// Divider with centered "OR"
export const OrDivider: React.FC<{ theme?: ThemeMode }> = ({ theme = "light" }) => {
  return (
    <div className="relative flex items-center justify-center my-4 select-none">
      <div
        className={`w-full border-t ${
          theme === "dark" ? "border-[#21262d]" : "border-[#e2e8f0]"
        }`}
      />
      <span
        className={`absolute px-3 text-xs font-semibold tracking-wider uppercase ${
          theme === "dark"
            ? "bg-[#0f1216] text-[#6e7681]"
            : "bg-white text-[#94a3b8]"
        }`}
      >
        OR
      </span>
    </div>
  );
};

// Floating cut-out "Enter email" input
interface FloatingEmailInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  theme?: ThemeMode;
  error?: string;
  autoFocus?: boolean;
}

export const FloatingEmailInput = forwardRef<HTMLInputElement, FloatingEmailInputProps>(
  ({ value, onChange, onSubmit, theme = "light", error, autoFocus = false }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSubmit) {
        onSubmit();
      }
    };

    const isLight = theme === "light";
    const hasFocusOrValue = isFocused || value.length > 0;

    return (
      <div className="flex flex-col gap-1 w-full">
        <div
          className={`relative rounded-xl border-2 transition-all duration-200 ${
            error
              ? "border-red-500 ring-2 ring-red-500/20"
              : isFocused
              ? "border-[#00b0ff] ring-2 ring-[#00b0ff]/20"
              : isLight
              ? "border-[#cbd5e1] hover:border-[#94a3b8]"
              : "border-[#30363d] hover:border-[#484f58]"
          } ${isLight ? "bg-white" : "bg-[#161b22]/40"}`}
        >
          {/* Notch floating label on top-left */}
          <label
            className={`absolute -top-2.5 left-4 px-1.5 text-xs font-medium transition-colors pointer-events-none ${
              isLight ? "bg-white" : "bg-[#0f1216]"
            } ${
              error
                ? "text-red-500"
                : isFocused
                ? "text-[#00b0ff] font-semibold"
                : isLight
                ? "text-[#64748b]"
                : "text-[#8c9ba5]"
            }`}
          >
            Enter email
          </label>

          <input
            ref={ref}
            type="email"
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={hasFocusOrValue ? "" : ""}
            className={`w-full h-13 px-4 pt-1 bg-transparent text-sm sm:text-base outline-none font-sans ${
              isLight ? "text-[#0f172a]" : "text-white"
            } caret-[#00b0ff]`}
          />
        </div>

        {error && <span className="text-xs text-red-500 px-1">{error}</span>}
      </div>
    );
  }
);
FloatingEmailInput.displayName = "FloatingEmailInput";

// Email Continue Button
interface EmailContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  theme?: ThemeMode;
  loading?: boolean;
}

export const EmailContinueButton: React.FC<EmailContinueButtonProps> = ({
  onClick,
  disabled = false,
  theme = "light",
  loading = false,
}) => {
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full h-12 rounded-full px-5 flex items-center justify-center gap-2.5 text-sm font-medium transition-all duration-200 select-none ${
        disabled
          ? isLight
            ? "bg-[#f1f5f9] text-[#94a3b8] border border-[#e2e8f0] cursor-not-allowed"
            : "bg-[#21262d] text-[#6e7681] border border-[#30363d] cursor-not-allowed"
          : isLight
          ? "bg-[#00b0ff] hover:bg-[#009ee6] text-white shadow-md shadow-[#00b0ff]/25 active:scale-[0.99] cursor-pointer"
          : "bg-[#00b0ff] hover:bg-[#009ee6] text-white shadow-md shadow-[#00b0ff]/30 active:scale-[0.99] cursor-pointer"
      }`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <Mail className="w-4 h-4 shrink-0 opacity-90" />
          <span>Continue with email</span>
        </>
      )}
    </button>
  );
};
