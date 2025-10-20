/**
 * WorldChat - Root Entry Point for Expo
 * 
 * This file fixes Metro bundler resolution issues in hybrid Next.js + Expo + pnpm setups.
 * 
 * Why this works:
 * - pnpm uses nested node_modules, making relative paths like "../../App" unreliable
 * - Expo's default AppEntry.js expects a flat node_modules structure
 * - By creating a root-level entry point, we bypass pnpm's nesting and provide
 *   an explicit path that Metro can resolve from the project root
 * - registerRootComponent() handles all Expo initialization (splash, assets, etc.)
 * 
 * Compatible with:
 * - pnpm package manager
 * - Expo SDK 54+
 * - React Native 0.76+
 * - Next.js 15 (coexisting)
 */

import { registerRootComponent } from 'expo';
import App from './App';

// Register the main App component with Expo
registerRootComponent(App);

