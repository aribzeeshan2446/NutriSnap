'use client';

import type { LogEntry } from '@/types';
import useLocalStorage from './use-local-storage';
import { useCallback } from 'react';

const CALORIE_LOG_KEY = 'nutrisnap_calorie_log';

export function useCalorieLog() {
  const [logEntries, setLogEntries] = useLocalStorage<LogEntry[]>(CALORIE_LOG_KEY, []);

  const addLogEntry = useCallback((newEntryData: Omit<LogEntry, 'id' | 'date'>) => {
    const newEntry: LogEntry = {
      ...newEntryData,
      id: Date.now().toString(), // Simple ID generation
      date: new Date().toISOString(),
    };
    setLogEntries((prevEntries) => [newEntry, ...prevEntries]);
  }, [setLogEntries]);

  const deleteLogEntry = useCallback((id: string) => {
    setLogEntries((prevEntries) => prevEntries.filter(entry => entry.id !== id));
  }, [setLogEntries]);

  const updateLogEntry = useCallback((updatedEntry: LogEntry) => {
    setLogEntries((prevEntries) => 
      prevEntries.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry)
    );
  }, [setLogEntries]);

  return { logEntries, addLogEntry, deleteLogEntry, updateLogEntry, setLogEntries };
}
