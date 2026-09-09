import React from "react";
import { MobileApprovalsScreen } from "@/components/approvals/MobileApprovalsScreen";

interface ApprovalsScreenProps {
  onOpenDrawer?: () => void;
  onNavigateScreen?: (screen: string) => void;
}

export const ApprovalsScreen: React.FC<ApprovalsScreenProps> = ({
  onOpenDrawer,
  onNavigateScreen,
}) => {
  return (
    <MobileApprovalsScreen
      onOpenDrawer={onOpenDrawer}
      onNavigateScreen={onNavigateScreen}
    />
  );
};

export default ApprovalsScreen;
