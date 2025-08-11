import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import App from './App';

export const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
  if (Capacitor.isNativePlatform()) {
    await Haptics.impact({ style });
  }
};

const MobileApp: React.FC = () => {
  useEffect(() => {
    // Mobile-specific initialization
    if (Capacitor.isNativePlatform()) {
      // Configure status bar
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#1e293b' });
      
      // Hide splash screen after app loads
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);

      // Prevent default touch behaviors
      document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });

      // Handle device orientation changes
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      });

      // Add haptic feedback to all buttons
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'BUTTON' || target.closest('button')) {
          triggerHaptic(ImpactStyle.Light);
        }
      });
    }
  }, []);

  return (
    <div className={`
      ${Capacitor.isNativePlatform() ? 'mobile-app' : ''}
      min-h-screen w-full overflow-x-hidden
    `}>
      <App />
    </div>
  );
};

export default MobileApp;