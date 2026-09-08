import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface InfoBannerProps {
  bannerKey?: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ bannerKey = "clockify_banner_closed" }) => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(bannerKey) === "true";
  });

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(bannerKey, "true");
  };

  return (
    <div className="px-4 py-3 select-none">
      <div className="flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-[#78909c] shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-[14px] text-[#78909c] leading-snug">
            Timesheets and expenses got separated. Make sure to submit them both.
          </p>
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={handleDismiss}
              className="text-[#00b0ff] font-medium text-[14px] hover:underline active:opacity-75"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
