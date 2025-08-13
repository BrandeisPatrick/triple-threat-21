# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Triple Threat 21" - a React-based blackjack card game that runs both in the browser and as a mobile app using Capacitor. The game features an AI opponent powered by Gemini API, special cards mechanics, and multi-table gameplay.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production  
- `npm run preview` - Preview production build locally
- `npm run mobile:build` - Build and sync for mobile platforms
- `npm run mobile:android` - Build and open Android Studio
- `npm run mobile:ios` - Build and open Xcode
- `npm run mobile:run:android` - Build and run on Android device
- `npm run mobile:run:ios` - Build and run on iOS device
- `npm run mobile:live:android` - Run with live reload on Android
- `npm run mobile:live:ios` - Run with live reload on iOS

## Architecture

### Core Components Structure
- `App.tsx` - Main desktop/web application with game logic
- `MobileApp.tsx` - Mobile wrapper with Capacitor integrations (haptics, status bar)
- `index.tsx` - Entry point that detects platform and renders appropriate app

### Game State Management
Game state is managed in `App.tsx` using React hooks:
- Multiple simultaneous game tables (up to 3)
- Turn-based gameplay with AI decision making
- Round tracking and scoring system
- History/statistics tracking for each round

### Key Game Mechanics
- Standard blackjack rules with special card variants
- AI opponent with configurable difficulty
- Multi-table gameplay allowing parallel games
- "Overbust" mechanic where going over 21 allows continued play
- Statistics tracking (bust rate, improvement rate, etc.)

### Mobile Platform Integration
Uses Capacitor for mobile deployment:
- Platform detection via `Capacitor.isNativePlatform()`
- Haptic feedback integration
- Status bar and splash screen configuration
- Touch gesture prevention for multi-touch

### API Integration
- Gemini AI service for opponent decision making (`services/geminiService.ts`)
- Environment variable `GEMINI_API_KEY` required for AI functionality
- Leaderboard service for score persistence

### Component Organization
Components follow functional patterns:
- Pure presentation components in `components/` directory
- Game logic centralized in main App component
- Mobile-specific logic separated in MobileApp wrapper
- Custom hooks for mobile layout detection (`hooks/useMobileLayout.ts`)

### Type Safety
Comprehensive TypeScript types in `types.ts`:
- Card system with suits, ranks, and special properties
- Game state interfaces
- History tracking types
- Statistics data structures

### Build Configuration
- Vite for bundling with TypeScript support
- Capacitor config for mobile app settings
- Environment variable injection for API keys
- Path aliases configured (`@/*` points to root)

## Mobile Development Notes

When working with mobile features:
- Use `triggerHaptic()` from MobileApp.tsx for tactile feedback
- Check `Capacitor.isNativePlatform()` for platform-specific code
- Mobile builds require `npm run mobile:build` before opening in IDE
- Live reload available for development testing on devices