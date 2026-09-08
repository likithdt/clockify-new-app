
export function TimeTrackerEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none">
            {/* Clockify Alarm Clock / Stopwatch Graphic */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                {/* Decorative sparkles */}
                <div className="absolute -top-1 -right-1 text-[#f59e0b] animate-pulse">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                    </svg>
                </div>
                <div className="absolute top-2 -left-2 text-[#03a9f4]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                    </svg>
                </div>
                <div className="absolute bottom-2 -right-2 text-[#ec4899]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="6" />
                    </svg>
                </div>

                {/* Main Stopwatch SVG */}
                <svg
                    width="96"
                    height="96"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-sm"
                >
                    {/* Top Loop / Crown */}
                    <path
                        d="M44 8 C44 4, 56 4, 56 8 L56 16 L44 16 Z"
                        fill="#0288D1"
                    />
                    <circle
                        cx="50"
                        cy="6"
                        r="5"
                        stroke="#03A9F4"
                        strokeWidth="2.5"
                        fill="none"
                    />

                    {/* Left & Right Bell Ears */}
                    <path
                        d="M24 16 C18 10, 30 6, 34 14 Z"
                        fill="#03A9F4"
                    />
                    <path
                        d="M76 16 C82 10, 70 6, 66 14 Z"
                        fill="#03A9F4"
                    />

                    {/* Bottom feet */}
                    <rect x="26" y="86" width="6" height="10" rx="3" transform="rotate(25 26 86)" fill="#0288D1" />
                    <rect x="68" y="88" width="6" height="10" rx="3" transform="rotate(-25 68 88)" fill="#0288D1" />

                    {/* Outer Blue Case */}
                    <circle cx="50" cy="54" r="38" fill="#03A9F4" />
                    {/* Outer Case Highlight / Rim */}
                    <circle cx="50" cy="54" r="35" fill="#E1F5FE" />
                    {/* Inner Golden Ring */}
                    <circle cx="50" cy="54" r="31" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="2" />
                    {/* White Center Dial */}
                    <circle cx="50" cy="54" r="23" fill="#FFFFFF" />

                    {/* Dial Tick Marks */}
                    <circle cx="50" cy="34" r="1.5" fill="#CBD5E1" />
                    <circle cx="50" cy="74" r="1.5" fill="#CBD5E1" />
                    <circle cx="30" cy="54" r="1.5" fill="#CBD5E1" />
                    <circle cx="70" cy="54" r="1.5" fill="#CBD5E1" />
                    <circle cx="36" cy="40" r="1" fill="#E2E8F0" />
                    <circle cx="64" cy="40" r="1" fill="#E2E8F0" />
                    <circle cx="36" cy="68" r="1" fill="#E2E8F0" />
                    <circle cx="64" cy="68" r="1" fill="#E2E8F0" />

                    {/* Pink Play Triangle in Center */}
                    <polygon
                        points="46,45 60,54 46,63"
                        fill="#F43F5E"
                        stroke="#E11D48"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-[#1E293B] mb-1.5">
                Let&apos;s start tracking!
            </h2>

            {/* Subtitle */}
            <p className="text-xs text-[#64748B] mb-4">
                Install Clockify and track time anywhere.
            </p>

            {/* Platform Icons Row */}
            <div className="flex items-center gap-4 text-[#64748B] mb-3">
                {/* Android Icon */}
                <span title="Android" className="hover:text-[#10B981] transition cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8533 8.0834 12 8.0834s-3.5902.3276-5.1368.8664L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
                    </svg>
                </span>

                {/* Apple Icon */}
                <span title="macOS & iOS" className="hover:text-[#1E293B] transition cursor-pointer">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.61 1.34-.55.63-.99 1.68-.86 2.7 1.02.08 2.05-.53 2.55-1.19z" />
                    </svg>
                </span>

                {/* Chrome Icon */}
                <span title="Chrome Extension" className="hover:text-[#EA4335] transition cursor-pointer">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.79-2.367L1.931 5.47zm14.86 3.759l-5.414 9.378A5.451 5.451 0 0 0 12 17.455c1.837 0 3.475-.907 4.475-2.304l5.594-9.689A11.97 11.97 0 0 0 12 0v6.545c1.472 0 2.827.585 3.791 1.543l1 1.141z" />
                    </svg>
                </span>

                {/* Windows Icon */}
                <span title="Windows" className="hover:text-[#0078D4] transition cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.801" />
                    </svg>
                </span>
            </div>

            {/* 50+ integrations link */}
            <a
                href="#integrations"
                onClick={(e) => e.preventDefault()}
                className="text-xs font-semibold text-[#03A9F4] hover:text-[#0288D1] hover:underline transition"
            >
                50+ integrations
            </a>
        </div>
    );
}
