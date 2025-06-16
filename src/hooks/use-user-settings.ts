'use client';

import type { UserSettings } from '@/types';
import useLocalStorage from './use-local-storage';

const USER_SETTINGS_KEY = 'nutrisnap_user_settings';

const defaultSettings: UserSettings = {
  name: 'User', // Default name
  dailyCalorieGoal: 2000, // Default example
  // Initialize other settings as needed
  age: undefined,
  weight: undefined,
  height: undefined,
  gender: undefined,
  activityLevel: undefined,
  dailyProteinGoal: undefined,
  dailyCarbsGoal: undefined,
  dailyFatGoal: undefined,
};

export function useUserSettings() {
  const [settings, setSettings] = useLocalStorage<UserSettings>(USER_SETTINGS_KEY, defaultSettings);

  // Could add derived calculations here, e.g., BMR, TDEE, if not set directly
  // For now, we assume dailyCalorieGoal is set by the user or has a default.

  return { settings, setSettings };
}
