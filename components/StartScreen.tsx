import React, { useState, useEffect } from 'react';
import Balatro from './Balatro';
import { StartCard } from './StartCard';

interface StartScreenProps {
  onStartGame: () => void;
}

interface ColorPreset {
  name: string;
  color1: string;
  color2: string;
  color3: string;
  contrast: number;
  lighting: number;
  spinAmount: number;
}

const colorPresets: ColorPreset[] = [
  {
    name: "Primary Burst",
    color1: "#dc2626", // Red
    color2: "#2563eb", // Blue
    color3: "#eab308", // Yellow
    contrast: 2.5,
    lighting: 0.4,
    spinAmount: 0.2
  },
  {
    name: "Ocean Depths",
    color1: "#1e40af", // Deep Blue
    color2: "#0891b2", // Teal
    color3: "#06b6d4", // Cyan
    contrast: 2.8,
    lighting: 0.35,
    spinAmount: 0.15
  },
  {
    name: "Sunset Blaze",
    color1: "#ea580c", // Orange
    color2: "#ec4899", // Pink
    color3: "#a855f7", // Purple
    contrast: 2.6,
    lighting: 0.45,
    spinAmount: 0.25
  },
  {
    name: "Forest Mystique",
    color1: "#16a34a", // Green
    color2: "#059669", // Emerald
    color3: "#65a30d", // Lime
    contrast: 2.4,
    lighting: 0.3,
    spinAmount: 0.18
  },
  {
    name: "Royal Elegance",
    color1: "#7c3aed", // Purple
    color2: "#d97706", // Gold
    color3: "#6b7280", // Silver
    contrast: 2.7,
    lighting: 0.4,
    spinAmount: 0.12
  },
  {
    name: "Neon Cyber",
    color1: "#e11d48", // Magenta
    color2: "#0ea5e9", // Electric Blue
    color3: "#84cc16", // Lime Green
    contrast: 3.0,
    lighting: 0.5,
    spinAmount: 0.3
  },
  {
    name: "Fire & Ice",
    color1: "#dc2626", // Red
    color2: "#f8fafc", // White
    color3: "#1d4ed8", // Blue
    contrast: 2.2,
    lighting: 0.35,
    spinAmount: 0.22
  },
  {
    name: "Autumn Harvest",
    color1: "#ea580c", // Orange
    color2: "#92400e", // Brown
    color3: "#f59e0b", // Amber
    contrast: 2.3,
    lighting: 0.38,
    spinAmount: 0.16
  },
  {
    name: "Midnight Dreams",
    color1: "#581c87", // Dark Purple
    color2: "#1e3a8a", // Navy Blue
    color3: "#312e81", // Indigo
    contrast: 2.9,
    lighting: 0.25,
    spinAmount: 0.14
  },
  {
    name: "Electric Storm",
    color1: "#facc15", // Yellow
    color2: "#8b5cf6", // Purple
    color3: "#e5e7eb", // Light Gray
    contrast: 2.4,
    lighting: 0.42,
    spinAmount: 0.28
  }
];

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const [currentPreset, setCurrentPreset] = useState<ColorPreset>(colorPresets[0]);

  useEffect(() => {
    // Select random preset on component mount
    const randomIndex = Math.floor(Math.random() * colorPresets.length);
    setCurrentPreset(colorPresets[randomIndex]);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <Balatro 
        spinRotation={-1.5}
        spinSpeed={5.0}
        color1={currentPreset.color1}
        color2={currentPreset.color2} 
        color3={currentPreset.color3}
        contrast={currentPreset.contrast}
        lighting={currentPreset.lighting}
        spinAmount={currentPreset.spinAmount}
        isRotate={true}
        mouseInteraction={false}
      />
      <div className="relative z-10">
        <StartCard onClick={onStartGame} />
      </div>
    </div>
  );
};

export default StartScreen;