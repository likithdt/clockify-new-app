import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  id,
  "aria-label": ariaLabel,
}) => {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onChange(!checked);
        }
      }}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#03a9f4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121517] ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${
        checked
          ? "bg-[#0b3d60] border-2 border-[#03a9f4]"
          : "bg-[#292f38] border-2 border-[#3b4350]"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-md transition-transform duration-200 ease-in-out ${
          checked
            ? "translate-x-5 bg-[#03a9f4]"
            : "translate-x-0.5 bg-[#8b98a5]"
        }`}
      />
    </button>
  );
};
