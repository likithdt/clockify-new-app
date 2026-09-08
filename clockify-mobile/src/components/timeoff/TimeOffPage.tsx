import React from 'react';
import { MobileTimeOffScreen } from './MobileTimeOffScreen';
import { AndroidFrame } from '@/components/AndroidFrame';

/**
 * Clockify Mobile Time Off Page
 * Faithfully matches the native Clockify Android experience
 * as documented in WhatsApp reference video and screenshots.
 */
export const TimeOffPage: React.FC = () => {
  return (
    <div className="w-full h-full min-h-screen bg-[#0b0f17] flex items-center justify-center">
      <AndroidFrame>
        <MobileTimeOffScreen />
      </AndroidFrame>
    </div>
  );
};

export default TimeOffPage;
