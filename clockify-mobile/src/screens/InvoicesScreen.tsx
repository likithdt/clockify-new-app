import React from "react";
import { MobileInvoicesScreen } from "@/components/invoices/MobileInvoicesScreen";

interface InvoicesScreenProps {
  onOpenDrawer?: () => void;
  onNavigateScreen?: (screen: string) => void;
}

export const InvoicesScreen: React.FC<InvoicesScreenProps> = ({
  onOpenDrawer,
  onNavigateScreen,
}) => {
  return (
    <MobileInvoicesScreen
      onOpenDrawer={onOpenDrawer}
      onNavigateScreen={onNavigateScreen}
    />
  );
};

export default InvoicesScreen;
