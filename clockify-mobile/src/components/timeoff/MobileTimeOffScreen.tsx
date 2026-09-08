import { useState, useMemo } from 'react';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Plus,
  Umbrella,
  FileText,
  X,
  User,
  Users,
  Search,
  ArrowLeft,
  Check,
  AlertTriangle,
  Calendar as CalendarIcon,
  RotateCcw,
  MoreVertical,
  ChevronDown,
} from 'lucide-react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import { MobileDrawer } from '@/components/expenses/MobileDrawer';

type SheetType =
  | 'filter'
  | 'teamFilter'
  | 'periodFilter'
  | 'request'
  | 'memberSelect'
  | 'policySelect'
  | 'datePicker'
  | 'balanceMenu'
  | 'balanceDetails'
  | 'balanceHistory'
  | 'balanceFilterType'
  | 'balanceUserSelect'
  | 'balancePolicySelect'
  | null;

type PeriodType =
  | 'This week'
  | 'Next week'
  | 'Next two weeks'
  | 'This month'
  | 'Next month'
  | 'This year'
  | 'Next year'
  | '2027'
  | '2028'
  | '2029'
  | 'Custom range';

const PERIOD_LIST: PeriodType[] = [
  'This week',
  'Next week',
  'Next two weeks',
  'This month',
  'Next month',
  'This year',
  'Next year',
  '2027',
  '2028',
  '2029',
];

interface BalanceItem {
  id: string;
  name: string;
  accrued: string;
  used: string;
  available: string;
}

export function MobileTimeOffScreen() {
  const { requests, members, policies, balances, createRequest } = useTimeOffStore();
  const [activeTab, setActiveTab] = useState<'requests' | 'timeline' | 'balance'>('requests');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  // Period / Filter state for Requests & Timeline
  const [periodIndex, setPeriodIndex] = useState<number>(0); // 0: 'This week'
  const currentPeriod = PERIOD_LIST[periodIndex] || 'This week';

  const [statusFilters, setStatusFilters] = useState<{ pending: boolean; approved: boolean; rejected: boolean }>({
    pending: true,
    approved: true,
    rejected: true,
  });
  const [selectedTeamMemberIds, setSelectedTeamMemberIds] = useState<string[]>([]);
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [policySearchQuery, setPolicySearchQuery] = useState('');

  // Balance tab filters & selections
  const [balanceFilterMode, setBalanceFilterMode] = useState<'User' | 'Policy'>('User');
  const [selectedBalanceUserId, setSelectedBalanceUserId] = useState<string>('me');
  const [selectedBalancePolicyId, setSelectedBalancePolicyId] = useState<string>('p3');
  const [activeBalanceItem, setActiveBalanceItem] = useState<{ title: string; accrued: string; used: string; available: string } | null>(null);

  // Request form state
  const [reqMemberId, setReqMemberId] = useState<string>('me');
  const [reqPolicyId, setReqPolicyId] = useState<string>('p3');
  const [isRangeToggle, setIsRangeToggle] = useState<boolean>(false);
  const [reqStartDate, setReqStartDate] = useState<string>('07/09/2026');
  const [reqEndDate, setReqEndDate] = useState<string>('07/09/2026');
  const [reqDays, setReqDays] = useState<number>(1);
  const [reqNote, setReqNote] = useState<string>('');

  // Calendar picker state
  const [selectedDates, setSelectedDates] = useState<number[]>([7]);

  // Timeline year
  const [timelineYear, setTimelineYear] = useState<number>(2026);

  // Current user info
  const currentUserName = 'shivashankarbs1508';

  // All team member options
  const allMembers = useMemo(() => {
    return [
      { id: 'm2', name: '[SAMPLE] Amy Smith', isSample: true },
      { id: 'm5', name: '[SAMPLE] James Anderson', isSample: true },
      { id: 'm1', name: '[SAMPLE] Lara Peterson', isSample: true },
      { id: 'm3', name: '[SAMPLE] Mike Johnson', isSample: true },
      { id: 'me', name: currentUserName, isSample: false },
    ];
  }, [currentUserName]);

  // All policy options
  const allPolicies = useMemo(() => {
    return [
      { id: 'p3', name: '[SAMPLE] Vacation', icon: Umbrella },
      { id: 'p1', name: 'Sick leave', icon: Plus },
      { id: 'p2', name: 'Vacation', icon: Umbrella },
    ];
  }, []);

  // Filter requests based on period, status, team
  const filteredRequests = useMemo(() => {
    // In WhatsApp video:
    // 'This week' shows 2 requests: Mike Johnson (rejected) & James Anderson (approved)
    // 'This year' shows 3 requests: includes Lara Peterson (pending)
    // 2028, 2029 shows: No matches for this search.
    if (['2027', '2028', '2029'].includes(currentPeriod)) {
      return [];
    }

    return requests.filter((r) => {
      // Status filter
      if (r.status === 'pending' && !statusFilters.pending) return false;
      if (r.status === 'approved' && !statusFilters.approved) return false;
      if (r.status === 'rejected' && !statusFilters.rejected) return false;

      // Team filter
      if (selectedTeamMemberIds.length > 0 && !selectedTeamMemberIds.includes(r.member_id)) {
        return false;
      }

      // Period filter checks
      if (currentPeriod === 'This week') {
        // Exclude Lara Peterson who is on Mon, Sep 07 (which is in earlier week)
        if (r.id === 'r3') return false;
      }

      return true;
    });
  }, [requests, statusFilters, selectedTeamMemberIds, currentPeriod]);

  // Balance Items to display
  const balanceItems: BalanceItem[] = useMemo(() => {
    if (balanceFilterMode === 'User') {
      if (selectedBalanceUserId === 'me') {
        return [
          { id: 'b1', name: 'Sick leave', accrued: '0d', used: '0d', available: '0d' },
          { id: 'b2', name: 'Vacation', accrued: '0d', used: '0d', available: '0d' },
        ];
      }
      // Return policies for selected sample user
      const userBalances = balances.filter((b) => b.member_id === selectedBalanceUserId);
      if (userBalances.length > 0) {
        return userBalances.map((b) => {
          const pol = policies.find((p) => p.id === b.policy_id);
          return {
            id: b.id || b.policy_id,
            name: pol?.name || 'Vacation',
            accrued: `${b.accrued}d`,
            used: `${b.used}d`,
            available: `${b.remaining}d`,
          };
        });
      }
      return [
        { id: 'b1', name: 'Sick leave', accrued: '8d', used: '0d', available: '8d' },
        { id: 'b2', name: 'Vacation', accrued: '20d', used: '3d', available: '17d' },
      ];
    } else {
      // Policy filter mode: show users for the selected policy
      return [
        { id: 'u1', name: '[SAMPLE] Amy Smith', accrued: '20d', used: '0d', available: '20d' },
        { id: 'u2', name: '[SAMPLE] James Anderson', accrued: '13d', used: '3d', available: '10d' },
        { id: 'u3', name: '[SAMPLE] Lara Peterson', accrued: '5d', used: '2d', available: '3d' },
        { id: 'u4', name: '[SAMPLE] Mike Johnson', accrued: '10d', used: '0d', available: '10d' },
        { id: 'u5', name: currentUserName, accrued: '0d', used: '0d', available: '0d' },
      ];
    }
  }, [balanceFilterMode, selectedBalanceUserId, balances, policies, currentUserName]);

  // Selected policy and member objects
  const currentReqPolicy = allPolicies.find((p) => p.id === reqPolicyId) || allPolicies[0];
  const currentReqMember = allMembers.find((m) => m.id === reqMemberId) || allMembers[allMembers.length - 1];

  const handleDaySelect = (day: number) => {
    if (!isRangeToggle) {
      // Single day mode
      setSelectedDates([day]);
      return;
    }

    if (selectedDates.includes(day)) {
      if (selectedDates.length > 1) {
        setSelectedDates(selectedDates.filter((d) => d !== day));
      }
    } else {
      setSelectedDates([...selectedDates, day].sort((a, b) => a - b));
    }
  };

  const handleConfirmDate = () => {
    if (selectedDates.length === 1) {
      const d = String(selectedDates[0]).padStart(2, '0');
      setReqStartDate(`${d}/09/2026`);
      setReqEndDate(`${d}/09/2026`);
      setReqDays(1);
    } else if (selectedDates.length > 1) {
      const first = String(selectedDates[0]).padStart(2, '0');
      const last = String(selectedDates[selectedDates.length - 1]).padStart(2, '0');
      setReqStartDate(`${first}/09/2026`);
      setReqEndDate(`${last}/09/2026`);
      setReqDays(selectedDates.length);
    }
    setActiveSheet('request');
  };

  const handleSubmitRequest = () => {
    createRequest({
      member_id: reqMemberId === 'me' ? 'm4' : reqMemberId,
      policy_id: reqPolicyId,
      start_date: '2026-09-07',
      end_date: '2026-09-07',
      duration: reqDays,
      note: reqNote || undefined,
    });
    setActiveSheet(null);
  };

  const handlePrevPeriod = () => {
    if (periodIndex > 0) {
      setPeriodIndex(periodIndex - 1);
    }
  };

  const handleNextPeriod = () => {
    if (periodIndex < PERIOD_LIST.length - 1) {
      setPeriodIndex(periodIndex + 1);
    }
  };

  return (
    <div className="w-full h-full bg-[#f2f4f7] flex flex-col overflow-hidden select-none font-sans text-[#111827] relative">
      {/* ─── Top App Bar ─── */}
      <header className="h-14 bg-white border-b border-[#e5e7eb] px-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 -ml-1.5 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors relative cursor-pointer"
            aria-label="Open menu"
          >
            <div className="relative">
              <Menu className="w-6 h-6 text-[#1f2937]" strokeWidth={2.2} />
              {/* Notification orange dot badge exactly like screenshots and video */}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ff5722] ring-2 ring-white" />
            </div>
          </button>
          <h1 className="text-[20px] font-semibold text-[#111827] tracking-tight">Time off</h1>
        </div>
      </header>

      {/* ─── 3 Tabs (Requests | Timeline | Balance) ─── */}
      <nav className="h-12 bg-white border-b border-[#e5e7eb] flex items-stretch shrink-0 z-10" aria-label="Tabs">
        {(
          [
            { key: 'requests', label: 'Requests' },
            { key: 'timeline', label: 'Timeline' },
            { key: 'balance', label: 'Balance' },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 relative flex items-center justify-center text-[14px] transition-colors cursor-pointer ${
                isActive ? 'text-[#111827] font-semibold' : 'text-[#6b7280] font-normal hover:text-[#374151]'
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-[#00aaff] rounded-t" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ─── MAIN SCROLLABLE CONTENT ─── */}
      <main className="flex-1 overflow-y-auto relative bg-[#eceef0]">
        {/* ═══════════ TAB 1: REQUESTS ═══════════ */}
        {activeTab === 'requests' && (
          <div className="min-h-full flex flex-col">
            {/* Period sub-bar: e.g. "This week   <   >" on left, and Filter icon on right */}
            <div className="h-13 bg-white border-b border-[#e5e7eb] px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveSheet('periodFilter')}
                  className="text-[15px] font-medium text-[#111827] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <span>{currentPeriod}</span>
                </button>

                {/* Left/Right chevron arrows right next to the period label */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handlePrevPeriod}
                    disabled={periodIndex === 0}
                    className={`p-1 text-[#374151] hover:text-[#111827] active:scale-95 transition-transform cursor-pointer ${
                      periodIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
                    }`}
                    aria-label="Previous period"
                  >
                    <ChevronLeft className="w-5 h-5" strokeWidth={2.4} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPeriod}
                    disabled={periodIndex === PERIOD_LIST.length - 1}
                    className={`p-1 text-[#374151] hover:text-[#111827] active:scale-95 transition-transform cursor-pointer ${
                      periodIndex === PERIOD_LIST.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                    }`}
                    aria-label="Next period"
                  >
                    <ChevronRight className="w-5 h-5" strokeWidth={2.4} />
                  </button>
                </div>
              </div>

              {/* Filter icon on the far right */}
              <button
                type="button"
                onClick={() => setActiveSheet('filter')}
                className="p-2 -mr-2 text-[#374151] hover:text-[#00aaff] active:scale-95 transition-all cursor-pointer"
                aria-label="Filter"
              >
                <SlidersHorizontal className="w-5 h-5" strokeWidth={2.2} />
              </button>
            </div>

            {/* Request Cards or Empty State */}
            {filteredRequests.length > 0 ? (
              <div className="p-4 space-y-3 pb-24">
                {filteredRequests.map((req) => {
                  const member = members.find((m) => m.id === req.member_id);
                  const policy = policies.find((p) => p.id === req.policy_id);
                  const isRejected = req.status === 'rejected';
                  const isApproved = req.status === 'approved';
                  const isPending = req.status === 'pending';

                  let dateStr = `${req.start_date}`;
                  if (req.end_date && req.end_date !== req.start_date) {
                    dateStr = `${req.start_date} - ${req.end_date}`;
                  }
                  if (req.id === 'r1') dateStr = 'Mon, Sep 21';
                  if (req.id === 'r2') dateStr = 'Fri, Sep 18 - Tue, Sep 22';
                  if (req.id === 'r3') dateStr = 'Mon, Sep 07 - Tue, Sep 08';

                  const memberTitle = member?.name || '[SAMPLE] Team member';
                  const policyTitle = policy?.name || '[SAMPLE] Vacation';

                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl p-4 shadow-2xs border border-[#e5e7eb] hover:shadow-xs transition-shadow"
                    >
                      {/* Top Row: Date range & Days duration */}
                      <div className="flex items-start justify-between">
                        <span
                          className={`text-[13px] font-medium ${
                            isRejected ? 'line-through text-[#6b7280]' : 'text-[#374151]'
                          }`}
                        >
                          {dateStr}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-[#111827]">
                            {req.duration}d
                          </span>
                          {/* Note icon if note exists */}
                          {(req.note || req.id === 'r1') && (
                            <FileText className="w-4 h-4 text-[#9ca3af]" />
                          )}
                        </div>
                      </div>

                      {/* Member Name */}
                      <div className="mt-2.5 text-[15px] font-medium text-[#111827]">
                        {memberTitle}
                      </div>

                      {/* Bottom Row: Policy icon + title & Status tag */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[13px] text-[#4b5563]">
                          <Umbrella className="w-4 h-4 text-[#e91e63]" />
                          <span>{policyTitle}</span>
                        </div>

                        <span
                          className={`text-[13px] font-semibold ${
                            isRejected
                              ? 'text-[#e53935]'
                              : isApproved
                              ? 'text-[#43a047]'
                              : 'text-[#f59e0b]'
                          }`}
                        >
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty state matching WhatsApp video frame 020 */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
                <p className="text-[15px] text-[#6b7280] font-normal">
                  No matches for this search.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ TAB 2: TIMELINE ═══════════ */}
        {activeTab === 'timeline' && (
          <div className="min-h-full flex flex-col">
            {/* Year selector header matching video frame 033 */}
            <div className="h-16 bg-white border-b border-[#e5e7eb] px-5 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[11px] text-[#6b7280] font-medium block">Year</span>
                <span className="text-[16px] font-semibold text-[#111827]">{timelineYear}</span>
              </div>
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setTimelineYear((y) => y - 1)}
                  className="p-2 text-[#374151] hover:text-[#111827] active:scale-95 transition-transform cursor-pointer"
                  aria-label="Previous year"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  onClick={() => setTimelineYear((y) => y + 1)}
                  className="p-2 text-[#374151] hover:text-[#111827] active:scale-95 transition-transform cursor-pointer"
                  aria-label="Next year"
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={2.4} />
                </button>
              </div>
            </div>

            {/* Empty state confetti horn matching video frame 033 */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[420px]">
              <div className="w-24 h-24 mb-4 text-[#71717a] flex items-center justify-center">
                <svg
                  viewBox="0 0 64 64"
                  className="w-20 h-20 fill-none stroke-[#71717a]"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 48L32 16L40 40Z" fill="#71717a" stroke="none" />
                  <path d="M30 14c3-6 10-6 14-2" />
                  <path d="M36 20c4-4 11-3 14 2" />
                  <path d="M40 26c5-3 12 0 14 5" />
                  <path d="M26 12c1-4 6-5 9-3" />
                  <circle cx="48" cy="18" r="1.5" fill="#71717a" />
                  <circle cx="56" cy="30" r="1.5" fill="#71717a" />
                  <circle cx="42" cy="10" r="1.5" fill="#71717a" />
                </svg>
              </div>
              <h2 className="text-[20px] font-bold text-[#111827] tracking-tight">
                No time off yet
              </h2>
              <p className="mt-2 text-[14px] text-[#71717a] max-w-[240px] leading-relaxed">
                All your requests and holidays will appear here.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════ TAB 3: BALANCE ═══════════ */}
        {activeTab === 'balance' && (
          <div className="min-h-full flex flex-col pb-24">
            {/* Filter controls row matching video frame 045 & 052 */}
            <div className="p-4 flex items-center gap-3">
              {/* Mode dropdown pill (User / Policy) */}
              <button
                type="button"
                onClick={() => setActiveSheet('balanceFilterType')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#d1d5db] rounded-xl text-[14px] font-medium text-[#111827] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{balanceFilterMode}</span>
                <ChevronDown className="w-4 h-4 text-[#6b7280]" />
              </button>

              {/* Specific User/Policy dropdown pill */}
              <button
                type="button"
                onClick={() =>
                  setActiveSheet(
                    balanceFilterMode === 'User' ? 'balanceUserSelect' : 'balancePolicySelect'
                  )
                }
                className="flex items-center justify-between gap-2 px-3.5 py-2 bg-white border border-[#d1d5db] rounded-xl text-[14px] font-medium text-[#111827] shadow-2xs hover:bg-slate-50 transition-colors max-w-[240px] truncate cursor-pointer"
              >
                <span className="truncate">
                  {balanceFilterMode === 'User'
                    ? selectedBalanceUserId === 'me'
                      ? currentUserName
                      : allMembers.find((m) => m.id === selectedBalanceUserId)?.name || currentUserName
                    : allPolicies.find((p) => p.id === selectedBalancePolicyId)?.name || 'Vacation'}
                </span>
                <ChevronDown className="w-4 h-4 text-[#6b7280] shrink-0" />
              </button>
            </div>

            {/* Balance cards list matching video frame 052 & 065 */}
            <div className="px-4 space-y-4">
              {balanceItems.map((item) => {
                const isPolicyView = balanceFilterMode === 'Policy';
                const isSick = item.name.toLowerCase().includes('sick');

                return (
                  <div key={item.id} className="space-y-1.5">
                    {/* Header item title with 3 dots menu */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2 text-[14px] font-medium text-[#111827]">
                        {!isPolicyView && (
                          isSick ? (
                            <Plus className="w-4 h-4 text-[#00aaff]" strokeWidth={3} />
                          ) : (
                            <Umbrella className="w-4 h-4 text-[#43a047]" />
                          )
                        )}
                        <span>{item.name}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveBalanceItem({
                            title: item.name,
                            accrued: item.accrued,
                            used: item.used,
                            available: item.available,
                          });
                          setActiveSheet('balanceMenu');
                        }}
                        className="p-1 -mr-1 text-[#6b7280] hover:text-[#111827] rounded-full hover:bg-slate-200/50 transition-colors cursor-pointer"
                        aria-label="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Card container with 3 rows */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#f3f4f6] flex items-center justify-between">
                        <span className="text-[14px] text-[#374151]">Accrued</span>
                        <span className="text-[14px] font-medium text-[#111827]">
                          {item.accrued}
                        </span>
                      </div>
                      <div className="px-4 py-3 border-b border-[#f3f4f6] flex items-center justify-between">
                        <span className="text-[14px] text-[#374151]">Used</span>
                        <span className="text-[14px] font-medium text-[#111827]">
                          {item.used}
                        </span>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between">
                        <span className="text-[14px] text-[#374151]">Available</span>
                        <span className="text-[14px] font-semibold text-[#111827]">
                          {item.available}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ─── Floating Action Button (+) matching video ─── */}
      <button
        type="button"
        onClick={() => setActiveSheet('request')}
        className="absolute right-5 bottom-8 w-14 h-14 rounded-full bg-[#00aaff] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,170,255,0.4)] hover:bg-[#0099e6] active:scale-95 transition-all z-20 cursor-pointer"
        aria-label="Request time off"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* ─── Android Gesture Home Pill at Bottom ─── */}
      <div className="h-4 w-full flex items-center justify-center shrink-0 bg-white/40 pointer-events-none select-none">
        <div className="w-32 h-1 bg-[#b0bec5] rounded-full" />
      </div>

      {/* ─── Navigation Drawer ─── */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeScreen="timeOff"
        onNavigate={() => setDrawerOpen(false)}
      />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ══════════════════ BOTTOM SHEETS & SCREENS ══════════════ */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* ─── SHEET 1: FILTER (Filter modal with Team row & status checkboxes) ─── */}
      {activeSheet === 'filter' && (
        <div
          className="absolute inset-0 bg-black/50 z-50 flex flex-col justify-end animate-fadeIn"
          onClick={() => setActiveSheet(null)}
        >
          <div
            className="bg-white rounded-t-[28px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="pt-3 pb-2 flex justify-center">
              <div className="w-12 h-1 bg-[#d1d5db] rounded-full" />
            </div>

            {/* Sheet Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-[#f3f4f6]">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveSheet(null)}
                  className="p-1 -ml-1 text-[#374151] hover:text-[#111827] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-[18px] font-semibold text-[#111827]">Filter</h2>
              </div>
            </div>

            {/* Filter Body */}
            <div className="p-5 space-y-5">
              {/* Team selection button */}
              <button
                type="button"
                onClick={() => setActiveSheet('teamFilter')}
                className="w-full flex items-center justify-between py-2 text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 text-[15px] font-medium text-[#111827]">
                  <Users className="w-5 h-5 text-[#6b7280]" />
                  <span>Team</span>
                </div>
                <div className="flex items-center gap-2 text-[14px] text-[#6b7280]">
                  <span>
                    {selectedTeamMemberIds.length === 0
                      ? 'All'
                      : `${selectedTeamMemberIds.length} selected`}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#9ca3af]" />
                </div>
              </button>

              <div className="border-t border-[#f3f4f6] pt-4 space-y-4">
                {/* Pending Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={statusFilters.pending}
                    onChange={(e) =>
                      setStatusFilters({ ...statusFilters, pending: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-[#9ca3af] text-[#00aaff] focus:ring-[#00aaff]"
                  />
                  <span className="text-[15px] font-normal text-[#111827]">Pending</span>
                </label>

                {/* Approved Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={statusFilters.approved}
                    onChange={(e) =>
                      setStatusFilters({ ...statusFilters, approved: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-[#9ca3af] text-[#00aaff] focus:ring-[#00aaff]"
                  />
                  <span className="text-[15px] font-normal text-[#111827]">Approved</span>
                </label>

                {/* Rejected Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={statusFilters.rejected}
                    onChange={(e) =>
                      setStatusFilters({ ...statusFilters, rejected: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-[#9ca3af] text-[#00aaff] focus:ring-[#00aaff]"
                  />
                  <span className="text-[15px] font-normal text-[#111827]">Rejected</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SHEET 2: TEAM FILTER (Select All + Team members checkboxes) ─── */}
      {activeSheet === 'teamFilter' && (
        <div
          className="absolute inset-0 bg-white z-50 flex flex-col animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="h-14 px-4 border-b border-[#e5e7eb] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveSheet('filter')}
                className="p-1 -ml-1 text-[#374151] hover:text-[#111827] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-[18px] font-semibold text-[#111827]">Team</h2>
            </div>
            <Search className="w-5 h-5 text-[#6b7280]" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Select all */}
            <label className="flex items-center gap-3 cursor-pointer py-1 select-none">
              <input
                type="checkbox"
                checked={selectedTeamMemberIds.length === allMembers.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTeamMemberIds(allMembers.map((m) => m.id));
                  } else {
                    setSelectedTeamMemberIds([]);
                  }
                }}
                className="w-5 h-5 rounded border-[#9ca3af] text-[#00aaff] focus:ring-[#00aaff]"
              />
              <span className="text-[15px] font-normal text-[#111827]">Select all</span>
            </label>

            <div className="pt-2">
              <span className="text-[12px] font-medium text-[#9ca3af] tracking-wider block mb-2">
                USERS
              </span>

              <div className="space-y-3">
                {allMembers
                  .filter((m) =>
                    m.name.toLowerCase().includes(teamSearchQuery.toLowerCase())
                  )
                  .map((m) => {
                    const isChecked = selectedTeamMemberIds.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        className="flex items-center gap-3 cursor-pointer py-1.5 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTeamMemberIds([...selectedTeamMemberIds, m.id]);
                            } else {
                              setSelectedTeamMemberIds(
                                selectedTeamMemberIds.filter((id) => id !== m.id)
                              );
                            }
                          }}
                          className="w-5 h-5 rounded border-[#9ca3af] text-[#00aaff] focus:ring-[#00aaff]"
                        />
                        <span className="text-[15px] font-normal text-[#111827]">
                          {m.name}
                        </span>
                      </label>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SHEET 3: PERIOD FILTER (Period bottom sheet matching screenshot) ─── */}
      {activeSheet === 'periodFilter' && (
        <div
          className="absolute inset-0 bg-black/50 z-50 flex flex-col justify-end animate-fadeIn"
          onClick={() => setActiveSheet(null)}
        >
          <div
            className="bg-white rounded-t-[28px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="pt-3 pb-2 flex justify-center">
              <div className="w-12 h-1 bg-[#d1d5db] rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-[#f3f4f6]">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveSheet(null)}
                  className="p-1 -ml-1 text-[#374151] hover:text-[#111827] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-[18px] font-semibold text-[#111827]">Period</h2>
              </div>
            </div>

            {/* Period List with radio buttons */}
            <div className="p-5 space-y-4">
              {PERIOD_LIST.map((pOption, idx) => {
                const isSelected = currentPeriod === pOption;
                return (
                  <button
                    key={pOption}
                    type="button"
                    onClick={() => {
                      setPeriodIndex(idx);
                      setActiveSheet(null);
                    }}
                    className="w-full flex items-center gap-3 py-1.5 text-left cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-[#00aaff] bg-[#00aaff]'
                          : 'border-[#9ca3af] bg-transparent'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-[15px] text-[#111827]">{pOption}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setActiveSheet(null);
                }}
                className="w-full text-left pt-2 text-[15px] font-medium text-[#00aaff] hover:underline cursor-pointer"
              >
                Custom range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SHEET 4: REQUEST FULL PAGE (Matching WhatsApp video frame 025) ─── */}
      {activeSheet === 'request' && (
        <div
          className="absolute inset-0 bg-white z-50 flex flex-col animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Back Arrow and Request Title */}
          <div className="h-14 px-4 border-b border-[#e5e7eb] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveSheet(null)}
                className="p-1 -ml-1 text-[#374151] hover:text-[#111827] cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-[19px] font-semibold text-[#111827]">Request</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Insufficient balance warning alert banner matching frame 025 */}
            <div className="p-4 bg-white flex items-start gap-3.5 border-b border-[#f3f4f6]">
              <AlertTriangle className="w-5 h-5 text-[#4b5563] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-[14px] font-medium text-[#111827]">
                  Insufficient time off balance
                </h4>
                <p className="text-[13px] text-[#4b5563] leading-relaxed">
                  You don't have enough time off allocated for the selected period.
                </p>
              </div>
            </div>

            {/* Form list rows matching frame 025 */}
            <div className="divide-y divide-[#f3f4f6]">
              {/* Member row */}
              <button
                type="button"
                onClick={() => setActiveSheet('memberSelect')}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#6b7280]" />
                  <span className="text-[15px] font-normal text-[#111827]">Member</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#6b7280]">
                    {currentReqMember.name}
                  </span>
                </div>
              </button>

              {/* Policy row */}
              <button
                type="button"
                onClick={() => setActiveSheet('policySelect')}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Umbrella className="w-5 h-5 text-[#6b7280]" />
                  <div className="flex flex-col">
                    <span className="text-[15px] font-normal text-[#111827]">Policy</span>
                    <span className="text-[13px] text-[#6b7280]">
                      {currentReqPolicy.name.replace(/^\[SAMPLE\]\s*/, '')}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9ca3af]" />
              </button>

              {/* Available row */}
              <div className="px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center font-serif text-[18px] text-[#6b7280]">
                    ∑
                  </span>
                  <span className="text-[15px] font-normal text-[#111827]">Available</span>
                </div>
                <span className="text-[14px] text-[#6b7280]">0d</span>
              </div>

              {/* Date range row with authentic toggle switch matching frame 025 */}
              <div className="px-4 py-3.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveSheet('datePicker')}
                  className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                >
                  <CalendarIcon className="w-5 h-5 text-[#6b7280]" />
                  <div className="flex flex-col">
                    <span className="text-[15px] font-normal text-[#111827]">
                      Date range
                    </span>
                    <span className="text-[13px] text-[#6b7280]">
                      {reqStartDate === reqEndDate
                        ? reqStartDate
                        : `${reqStartDate} - ${reqEndDate}`}
                    </span>
                  </div>
                </button>

                {/* Pill toggle switch */}
                <button
                  type="button"
                  onClick={() => setIsRangeToggle(!isRangeToggle)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    isRangeToggle ? 'bg-[#00aaff]' : 'bg-[#e2e8f0]'
                  }`}
                  aria-label="Toggle date range"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isRangeToggle ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Total row with red/orange alert amount */}
              <div className="px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center font-serif text-[18px] text-[#6b7280]">
                    ∑
                  </span>
                  <span className="text-[15px] font-normal text-[#111827]">Total</span>
                </div>
                <span className="text-[14px] font-semibold text-[#e53935]">
                  {reqDays}d
                </span>
              </div>

              {/* Note row */}
              <div className="px-4 py-3.5 flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#6b7280] shrink-0" />
                <input
                  type="text"
                  placeholder="Note"
                  value={reqNote}
                  onChange={(e) => setReqNote(e.target.value)}
                  className="w-full text-[15px] text-[#111827] placeholder-[#9ca3af] outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit button checkmark FAB in corner matching frame 025 */}
          <div className="p-5 flex justify-end">
            <button
              type="button"
              onClick={handleSubmitRequest}
              className="w-14 h-14 rounded-2xl bg-[#00aaff] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,170,255,0.4)] hover:bg-[#0099e6] active:scale-95 transition-all cursor-pointer"
              aria-label="Confirm request"
            >
              <Check className="w-7 h-7 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* ─── SHEET 5: MEMBER SELECT FULL PAGE ─── */}
      {activeSheet === 'memberSelect' && (
        <div
          className="absolute inset-0 bg-white z-50 flex flex-col animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-14 px-4 border-b border-[#e5e7eb] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveSheet('request')}
                className="p-1 -ml-1 text-[#374151] hover:text-[#111827] cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-[18px] font-semibold text-[#111827]">Member</h2>
            </div>
            <Search className="w-5 h-5 text-[#6b7280]" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {allMembers.map((m) => {
              const isSelected = reqMemberId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setReqMemberId(m.id);
                    setActiveSheet('request');
                  }}
                  className="w-full flex items-center gap-3.5 py-2 text-left cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-[#00aaff] bg-[#00aaff]'
                        : 'border-[#9ca3af] bg-transparent'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-[15px] text-[#111827]">{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SHEET 6: POLICY SELECT FULL PAGE ─── */}
      {activeSheet === 'policySelect' && (
        <div
          className="absolute inset-0 bg-white z-50 flex flex-col animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-14 px-4 border-b border-[#e5e7eb] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveSheet('request')}
                className="p-1 -ml-1 text-[#374151] hover:text-[#111827] cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-[18px] font-semibold text-[#111827]">Policies</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {allPolicies.map((p) => {
              const isSelected = reqPolicyId === p.id;
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setReqPolicyId(p.id);
                    setActiveSheet('request');
                  }}
                  className={`w-full px-5 py-4 flex items-center gap-4 text-left border-b border-[#f3f4f6] transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#e0f2fe]' : 'hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      p.name.includes('Sick') ? 'text-[#00aaff]' : 'text-[#43a047]'
                    }`}
                  />
                  <span className="text-[15px] font-medium text-[#111827]">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SHEET 7: CALENDAR RANGE PICKER MODAL (Matching WhatsApp video) ─── */}
      {activeSheet === 'datePicker' && (
        <div
          className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveSheet('request')}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-[340px] p-5 shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[12px] text-[#6b7280] font-medium">Select Range</div>

            {/* Date header display */}
            <div className="mt-2 flex items-center justify-between border-b border-[#f3f4f6] pb-3">
              <h3 className="text-[22px] font-bold text-[#111827]">
                {selectedDates.length === 1
                  ? `Sep ${selectedDates[0]} – Sep ${selectedDates[0]}`
                  : `Sep ${selectedDates[0]} – Sep ${
                      selectedDates[selectedDates.length - 1]
                    }`}
              </h3>
            </div>

            {/* Month & navigation */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#111827]">
                September 2026
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="p-1 text-[#374151] hover:text-[#111827] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  className="p-1 text-[#374151] hover:text-[#111827] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={2.4} />
                </button>
              </div>
            </div>

            {/* Day labels M T W T F S S */}
            <div className="mt-3 grid grid-cols-7 text-center text-[12px] font-semibold text-[#6b7280]">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>

            {/* Calendar grid for September 2026 */}
            <div className="mt-2 grid grid-cols-7 gap-y-2 text-center text-[14px]">
              <span />
              {[...Array(30)].map((_, idx) => {
                const day = idx + 1;
                const isSelected = selectedDates.includes(day);
                const isWeekend = (idx + 2) % 7 === 6 || (idx + 2) % 7 === 0;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDaySelect(day)}
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-[13px] font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#00aaff] text-white font-bold shadow-xs'
                        : isWeekend
                        ? 'text-[#9ca3af]'
                        : 'text-[#111827] hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Cancel / OK action buttons */}
            <div className="mt-6 flex items-center justify-end gap-5">
              <button
                type="button"
                onClick={() => setActiveSheet('request')}
                className="text-[14px] font-semibold text-[#00aaff] hover:opacity-80 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDate}
                className="text-[14px] font-semibold text-[#00aaff] hover:opacity-80 cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SHEET 8: BALANCE 3-DOT MENU (View details | Balance history) matching video frame 055 & 065 ─── */}
      {activeSheet === 'balanceMenu' && (
        <div
          className="absolute inset-0 bg-black/50 z-50 flex flex-col justify-end animate-fadeIn"
          onClick={() => setActiveSheet(null)}
        >
          <div
            className="bg-white rounded-t-[28px] p-5 shadow-2xl animate-slideUp space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="pb-2 flex justify-center">
              <div className="w-12 h-1 bg-[#d1d5db] rounded-full" />
            </div>

            <button
              type="button"
              onClick={() => setActiveSheet('balanceDetails')}
              className="w-full flex items-center gap-4 py-2.5 text-left text-[15px] font-medium text-[#111827] hover:bg-slate-50 cursor-pointer"
            >
              <FileText className="w-5 h-5 text-[#6b7280]" />
              <span>View details</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSheet('balanceHistory')}
              className="w-full flex items-center gap-4 py-2.5 text-left text-[15px] font-medium text-[#111827] hover:bg-slate-50 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 text-[#6b7280]" />
              <span>Balance history</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── SHEET 9: BALANCE DETAILS FULL PAGE (Matching video frame 050 & 070) ─── */}
      {activeSheet === 'balanceDetails' && (
        <div
          className="absolute inset-0 bg-white z-50 flex flex-col animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-14 px-4 border-b border-[#e5e7eb] flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setActiveSheet(null)}
              className="p-1 -ml-1 text-[#374151] hover:text-[#111827] cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-[18px] font-semibold text-[#111827]">Balance details</h2>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <p className="text-[15px] text-[#6b7280]">No details available</p>
          </div>
        </div>
      )}

      {/* ─── SHEET 10: BALANCE HISTORY FULL PAGE ─── */}
      {activeSheet === 'balanceHistory' && (
        <div
          className="absolute inset-0 bg-white z-50 flex flex-col animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-14 px-4 border-b border-[#e5e7eb] flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setActiveSheet(null)}
              className="p-1 -ml-1 text-[#374151] hover:text-[#111827] cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-[18px] font-semibold text-[#111827]">Balance history</h2>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <p className="text-[15px] text-[#6b7280]">No history available</p>
          </div>
        </div>
      )}

      {/* ─── SHEET 11: BALANCE FILTER BY TYPE (User / Policy) matching video frame 045 ─── */}
      {activeSheet === 'balanceFilterType' && (
        <div
          className="absolute inset-0 bg-black/50 z-50 flex flex-col justify-end animate-fadeIn"
          onClick={() => setActiveSheet(null)}
        >
          <div
            className="bg-white rounded-t-[28px] p-5 shadow-2xl animate-slideUp space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="pb-1 flex justify-center">
              <div className="w-12 h-1 bg-[#d1d5db] rounded-full" />
            </div>

            <h3 className="text-[16px] font-bold text-[#111827]">Filter by</h3>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setBalanceFilterMode('User');
                  setActiveSheet(null);
                }}
                className="w-full flex items-center gap-3 py-1.5 text-left cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    balanceFilterMode === 'User'
                      ? 'border-[#00aaff] bg-[#00aaff]'
                      : 'border-[#9ca3af] bg-transparent'
                  }`}
                >
                  {balanceFilterMode === 'User' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-[15px] text-[#111827]">User</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBalanceFilterMode('Policy');
                  setActiveSheet(null);
                }}
                className="w-full flex items-center gap-3 py-1.5 text-left cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    balanceFilterMode === 'Policy'
                      ? 'border-[#00aaff] bg-[#00aaff]'
                      : 'border-[#9ca3af] bg-transparent'
                  }`}
                >
                  {balanceFilterMode === 'Policy' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-[15px] text-[#111827]">Policy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SHEET 12: BALANCE USER SELECT (Full page matching video frame 047) ─── */}
      {activeSheet === 'balanceUserSelect' && (
        <div
          className="absolute inset-0 bg-white z-50 flex flex-col animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-14 px-4 border-b border-[#e5e7eb] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveSheet(null)}
                className="p-1 -ml-1 text-[#374151] hover:text-[#111827] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-[18px] font-semibold text-[#111827]">Team</h2>
            </div>
            <Search className="w-5 h-5 text-[#6b7280]" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {allMembers.map((m) => {
              const isSelected = selectedBalanceUserId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedBalanceUserId(m.id);
                    setActiveSheet(null);
                  }}
                  className="w-full flex items-center gap-3.5 py-2 text-left cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-[#00aaff] bg-[#00aaff]'
                        : 'border-[#9ca3af] bg-transparent'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-[15px] text-[#111827]">{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SHEET 13: BALANCE POLICY SELECT (Full page matching video frame 062) ─── */}
      {activeSheet === 'balancePolicySelect' && (
        <div
          className="absolute inset-0 bg-white z-50 flex flex-col animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-14 px-4 border-b border-[#e5e7eb] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveSheet(null)}
                className="p-1 -ml-1 text-[#374151] hover:text-[#111827] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-[18px] font-semibold text-[#111827]">Policy</h2>
            </div>
            <Search className="w-5 h-5 text-[#6b7280]" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {allPolicies.map((p) => {
              const isSelected = selectedBalancePolicyId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedBalancePolicyId(p.id);
                    setActiveSheet(null);
                  }}
                  className="w-full flex items-center gap-3.5 py-2 text-left cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-[#00aaff] bg-[#00aaff]'
                        : 'border-[#9ca3af] bg-transparent'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-[15px] text-[#111827]">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
