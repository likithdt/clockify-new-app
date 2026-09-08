import React, { useState } from "react";
import { LoginScreen } from "./LoginScreen";
import { SignUpScreen } from "./SignUpScreen";
import { OtpVerificationScreen } from "./OtpVerificationScreen";
import { GoogleOAuthModal } from "./GoogleOAuthModal";
import { MicrosoftOAuthModal } from "./MicrosoftOAuthModal";
import { AndroidFrame } from "@/components/AndroidFrame";
import { ClockifyLogo, CakeFooter } from "./AuthComponents";
import { useAuthStore, UserSession } from "@/stores/useAuthStore";
import { Sun, Moon, Smartphone, Monitor, Sparkles, Mail, CheckCircle2, LogOut, ShieldCheck } from "lucide-react";

export const AuthPage: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    theme,
    toggleTheme,
    pendingEmail,
    requestEmailOtp,
    verifyOtp,
    loginWithProfile,
    isGoogleModalOpen,
    openGoogleModal,
    closeGoogleModal,
    isMicrosoftModalOpen,
    openMicrosoftModal,
    closeMicrosoftModal,
    generatedOtp,
    otpNotification,
    setOtpNotification,
    isAuthenticated,
    user,
    logout,
  } = useAuthStore();

  const [useDeviceFrame, setUseDeviceFrame] = useState(true);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Handle continuing with email
  const handleContinueWithEmail = async (email: string) => {
    await requestEmailOtp(email);
  };

  // Handle OTP verification
  const handleVerifyOtp = async (code: string) => {
    const success = await verifyOtp(code);
    if (success) {
      setSuccessToast("Successfully logged in!");
      setTimeout(() => setSuccessToast(null), 2500);
    }
  };

  // Handle account selected from Google OAuth modal
  const handleGoogleAccountSelected = (selectedUser: UserSession) => {
    loginWithProfile(selectedUser);
    setSuccessToast(`Signed in with Google as ${selectedUser.name}`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  // Handle account selected from Microsoft OAuth modal
  const handleMicrosoftAccountSelected = (selectedUser: UserSession) => {
    loginWithProfile(selectedUser);
    setSuccessToast(`Signed in with Microsoft as ${selectedUser.name}`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const renderCurrentScreen = () => {
    // If authenticated, display the self-contained logged-in profile view
    if (isAuthenticated && user) {
      const isLight = theme === "light";
      return (
        <div
          className={`w-full h-full flex flex-col justify-between px-6 sm:px-8 py-6 transition-colors duration-200 select-none overflow-y-auto ${
            isLight ? "bg-white text-[#0f172a]" : "bg-[#0f1216] text-white"
          }`}
        >
          {/* Brand Header */}
          <div className="flex flex-col items-center pt-3">
            <ClockifyLogo theme={theme} />

            {/* Profile Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#1a73e8] text-white flex items-center justify-center text-xl font-bold mt-5 shadow-lg border-2 border-white/20">
              {user.avatarInitials}
            </div>

            <h2 className="text-xl font-bold mt-3 text-center">{user.name}</h2>
            <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {user.email}
            </p>

            <div className="mt-3 px-3 py-1 bg-[#00b0ff]/10 text-[#00b0ff] rounded-full text-xs font-semibold flex items-center gap-1.5 border border-[#00b0ff]/25">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Signed In Successfully</span>
            </div>
          </div>

          {/* Session Details */}
          <div className="my-auto max-w-[340px] w-full mx-auto flex flex-col gap-3 py-4">
            <div
              className={`p-4 rounded-2xl border ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-700 shadow-xs"
                  : "bg-[#161b22] border-[#30363d] text-slate-300"
              } text-xs space-y-2.5`}
            >
              <div className="flex justify-between items-center">
                <span className={isLight ? "text-slate-400" : "text-slate-500"}>Workspace:</span>
                <span className="font-semibold">{user.workspace}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isLight ? "text-slate-400" : "text-slate-500"}>Auth Provider:</span>
                <span className="font-semibold">
                  {user.email.includes("gmail")
                    ? "Google Identity"
                    : user.email.includes("outlook")
                    ? "Microsoft 365"
                    : "Email Security Code"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isLight ? "text-slate-400" : "text-slate-500"}>Status:</span>
                <span className="font-semibold text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Authenticated
                </span>
              </div>
            </div>

            {/* Sign Out button to test again */}
            <button
              type="button"
              onClick={logout}
              className={`w-full h-12 rounded-full border text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isLight
                  ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out / Return to Login</span>
            </button>
          </div>

          {/* Footer */}
          <CakeFooter theme={theme} />
        </div>
      );
    }

    switch (currentScreen) {
      case "signup":
        return (
          <SignUpScreen
            theme={theme}
            initialEmail={pendingEmail}
            onContinueWithEmail={handleContinueWithEmail}
            onContinueWithGoogle={openGoogleModal}
            onContinueWithMicrosoft={openMicrosoftModal}
            onNavigateToLogin={() => setCurrentScreen("login")}
            onBack={() => setCurrentScreen("login")}
          />
        );

      case "otp":
        return (
          <OtpVerificationScreen
            theme={theme}
            email={pendingEmail}
            onVerifyOtp={handleVerifyOtp}
            onBack={() => setCurrentScreen("login")}
            onResendCode={() => {
              requestEmailOtp(pendingEmail);
            }}
          />
        );

      case "login":
      default:
        return (
          <LoginScreen
            theme={theme}
            initialEmail={pendingEmail}
            onContinueWithEmail={handleContinueWithEmail}
            onContinueWithGoogle={openGoogleModal}
            onContinueWithMicrosoft={openMicrosoftModal}
            onNavigateToSignUp={() => setCurrentScreen("signup")}
          />
        );
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 overflow-x-hidden relative">
      {/* Top Interactive Toolbar */}
      <header className="shrink-0 h-13 px-4 sm:px-6 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#00b0ff] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white hidden sm:inline">
              Clockify Mobile Auth
            </span>
          </div>

          {/* Screen Navigation Tabs */}
          {!isAuthenticated && (
            <div className="flex items-center bg-[#0d1117] rounded-lg p-1 border border-[#30363d] text-xs">
              <button
                type="button"
                onClick={() => setCurrentScreen("login")}
                className={`px-3 py-1 rounded-md transition-all font-medium cursor-pointer ${
                  currentScreen === "login"
                    ? "bg-[#00b0ff] text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setCurrentScreen("signup")}
                className={`px-3 py-1 rounded-md transition-all font-medium cursor-pointer ${
                  currentScreen === "signup"
                    ? "bg-[#00b0ff] text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => setCurrentScreen("otp")}
                className={`px-3 py-1 rounded-md transition-all font-medium cursor-pointer ${
                  currentScreen === "otp"
                    ? "bg-[#00b0ff] text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Check email (OTP)
              </button>
            </div>
          )}
        </div>

        {/* Right Tools: Theme & Frame Toggles */}
        <div className="flex items-center gap-2">
          {/* Theme Mode Toggle (defaults to Light Theme as requested) */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              theme === "light"
                ? "bg-amber-400/10 border-amber-400/30 text-amber-300 hover:bg-amber-400/20"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
            title="Toggle between Light and Dark Theme"
          >
            {theme === "light" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light Theme (Active)</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Dark Theme</span>
              </>
            )}
          </button>

          {/* Device Frame / Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setUseDeviceFrame(!useDeviceFrame)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            title="Toggle Device Frame"
          >
            {useDeviceFrame ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#00b0ff]" />
                <span className="hidden sm:inline">Android Frame</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Full Screen</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Body Content */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-4 overflow-hidden relative">
        {/* Simulated Android Notification Banner when OTP is requested */}
        {otpNotification && currentScreen === "otp" && !isAuthenticated && (
          <div className="absolute top-4 sm:top-6 z-[90] max-w-[390px] w-[90%] mx-auto bg-slate-900/95 text-white border border-[#00b0ff]/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md animate-slideUp flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#00b0ff] flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#00b0ff]">Clockify Auth</span>
                <span className="text-[10px] text-slate-400">Just now</span>
              </div>
              <p className="text-slate-200 mt-0.5">
                Your verification code is{" "}
                <span className="font-bold text-white tracking-widest bg-white/10 px-1.5 py-0.5 rounded">
                  {generatedOtp}
                </span>
              </p>
              <button
                type="button"
                onClick={() => {
                  if (generatedOtp) {
                    handleVerifyOtp(generatedOtp);
                    setOtpNotification(null);
                  }
                }}
                className="mt-2 text-[11px] text-[#00b0ff] hover:text-white font-semibold flex items-center gap-1 cursor-pointer underline"
              >
                Auto-fill &amp; Verify
              </button>
            </div>
          </div>
        )}

        {/* Global Login Success Toast */}
        {successToast && (
          <div className="absolute top-6 z-[100] bg-emerald-600 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {useDeviceFrame ? (
          <AndroidFrame
            theme={theme}
            time="9:46"
            onBackPress={() => {
              if (isAuthenticated) {
                logout();
              } else if (currentScreen === "otp" || currentScreen === "signup") {
                setCurrentScreen("login");
              }
            }}
            onHomePress={() => {
              if (isAuthenticated) {
                logout();
              } else {
                setCurrentScreen("login");
              }
            }}
          >
            {renderCurrentScreen()}
          </AndroidFrame>
        ) : (
          <div
            className={`w-full max-w-[480px] h-[100dvh] sm:h-[860px] sm:rounded-2xl overflow-hidden shadow-2xl transition-colors ${
              theme === "light" ? "bg-white" : "bg-[#0f1216]"
            }`}
          >
            {renderCurrentScreen()}
          </div>
        )}
      </main>

      {/* Google OAuth Modal Dialog */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={closeGoogleModal}
        onSelectAccount={handleGoogleAccountSelected}
      />

      {/* Microsoft OAuth Modal Dialog */}
      <MicrosoftOAuthModal
        isOpen={isMicrosoftModalOpen}
        onClose={closeMicrosoftModal}
        onSelectAccount={handleMicrosoftAccountSelected}
      />
    </div>
  );
};
