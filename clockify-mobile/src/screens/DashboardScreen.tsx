import React from "react";
import { MobileDashboardScreen } from "@/components/dashboard/MobileDashboardScreen";

interface DashboardScreenProps {
  onOpenDrawer?: () => void;
  onNavigateScreen?: (screen: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onOpenDrawer,
  onNavigateScreen,
}) => {
  return (
    <MobileDashboardScreen
      onOpenDrawer={onOpenDrawer}
      onNavigateScreen={onNavigateScreen}
    />
  );
};

export default DashboardScreen;
