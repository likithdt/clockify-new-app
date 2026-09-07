import React, { useEffect } from 'react';
import { useTimeOffStore } from '@/stores/useTimeOffStore';
import { RequestsTab } from './RequestsTab';
import { TimelineTab } from './TimelineTab';
import { BalanceTab } from './BalanceTab';
import { PoliciesTab } from './PoliciesTab';
import { HolidaysTab } from './HolidaysTab';
import { RequestTimeOffModal } from './modals/RequestTimeOffModal';
import { CreatePolicyModal } from './modals/CreatePolicyModal';
import { EditPolicyModal } from './modals/EditPolicyModal';
import { CreateHolidayModal } from './modals/CreateHolidayModal';
import { EditHolidayModal } from './modals/EditHolidayModal';
import { ImportHolidaysModal } from './modals/ImportHolidaysModal';
import { ToastContainer } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Plus } from 'lucide-react';

export const TimeOffPage: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsRequestModalOpen,
    fetchData,
  } = useTimeOffStore();

  useEffect(() => {
    fetchData();

    // Listen to hashchange event to keep tab in sync with browser navigation
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as typeof activeTab;
      const valid: (typeof activeTab)[] = ['timeline', 'requests', 'balance', 'holidays', 'policies'];
      if (valid.includes(hash) && hash !== activeTab) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [fetchData, activeTab, setActiveTab]);

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'timeline', label: 'TIMELINE' },
    { key: 'requests', label: 'REQUESTS' },
    { key: 'balance', label: 'BALANCE' },
    { key: 'holidays', label: 'HOLIDAYS' },
    { key: 'policies', label: 'POLICIES' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#f5f7f9] p-6 relative">
      {/* Title & Top Action */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
          Time off
        </h1>

        <button
          type="button"
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-semibold px-4 py-2 rounded tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Request Time Off</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 select-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 text-xs font-bold tracking-wider transition-colors relative cursor-pointer ${
                isActive
                  ? 'text-slate-800 bg-white border-t-2 border-t-[#03a9f4] border-x border-slate-200 rounded-t shadow-xs -mb-px'
                  : 'text-slate-500 hover:text-slate-700 bg-slate-100/70 hover:bg-slate-200/50 rounded-t'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 pb-10">
        {activeTab === 'timeline' && <TimelineTab />}
        {activeTab === 'requests' && <RequestsTab />}
        {activeTab === 'balance' && <BalanceTab />}
        {activeTab === 'holidays' && <HolidaysTab />}
        {activeTab === 'policies' && <PoliciesTab />}
      </div>

      {/* Modals & Dialogs */}
      <RequestTimeOffModal />
      <CreatePolicyModal />
      <EditPolicyModal />
      <CreateHolidayModal />
      <EditHolidayModal />
      <ImportHolidaysModal />

      {/* Global UI Components */}
      <ConfirmDialog />
      <ToastContainer />
    </div>
  );
};
