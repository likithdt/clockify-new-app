import React from "react";
import { MobileRatesScreen } from "@/components/rates/MobileRatesScreen";

interface RatesScreenProps {
  onOpenDrawer?: () => void;
  onNavigateScreen?: (screen: string) => void;
}

export const RatesScreen: React.FC<RatesScreenProps> = ({
  onOpenDrawer,
  onNavigateScreen,
}) => {
  return (
    <MobileRatesScreen
      onOpenDrawer={onOpenDrawer}
      onNavigateScreen={onNavigateScreen}
    />
  );
};

export default RatesScreen;
