import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

interface MobileLayout {
  isMobile: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  isNative: boolean;
}

export const useMobileLayout = (): MobileLayout => {
  const [layout, setLayout] = useState<MobileLayout>(() => ({
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isLandscape: window.innerWidth > window.innerHeight,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    isNative: Capacitor.isNativePlatform()
  }));

  useEffect(() => {
    const handleResize = () => {
      setLayout({
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        isLandscape: window.innerWidth > window.innerHeight,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        isNative: Capacitor.isNativePlatform()
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return layout;
};