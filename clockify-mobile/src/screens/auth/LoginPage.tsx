import React from "react";
import { AuthPage } from "./AuthPage";

/**
 * Standalone Clockify Mobile Login Page
 * 
 * Completely self-contained authentication module matching reference designs:
 * - "Log in" screen (WhatsApp Image 2026-09-08 at 9.48.03 AM.jpeg)
 * - "Get started with Clockify" (WhatsApp Image 2026-09-08 at 9.48.03 AM (1).jpeg)
 * - "Check your email" OTP verification (WhatsApp Image 2026-09-08 at 9.48.04 AM.jpeg)
 * - Working Google OAuth & Microsoft OAuth modal prototypes
 */
export const LoginPage: React.FC = () => {
  return (
    <div className="h-screen w-screen overflow-hidden font-sans select-none">
      <AuthPage />
    </div>
  );
};

export default LoginPage;
