import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * A lightweight debounce utility to avoid external dependencies like lodash
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
/**
 * Returns consistent Tailwind color classes for dynamic entity backgrounds, text, and borders.
 * This resolves issues with Tailwind JIT not picking up interpolated class names.
 */
export function getColorClass(color: string = 'gray', variant: 'bg' | 'text' | 'border' | 'badge' = 'bg'): string {
  const map: Record<string, Record<string, string>> = {
    gray: { 
      bg: 'bg-zinc-100 dark:bg-zinc-800', 
      text: 'text-zinc-600 dark:text-zinc-400', 
      border: 'border-zinc-200 dark:border-zinc-700',
      badge: 'bg-zinc-100 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300'
    },
    blue: { 
      bg: 'bg-blue-100 dark:bg-blue-900/30', 
      text: 'text-blue-600 dark:text-blue-400', 
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
    },
    green: { 
      bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
      text: 'text-emerald-600 dark:text-emerald-400', 
      border: 'border-emerald-200 dark:border-emerald-800',
      badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
    },
    yellow: { 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
      text: 'text-yellow-600 dark:text-yellow-400', 
      border: 'border-yellow-200 dark:border-yellow-800',
      badge: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
    },
    orange: { 
      bg: 'bg-orange-100 dark:bg-orange-900/30', 
      text: 'text-orange-600 dark:text-orange-400', 
      border: 'border-orange-200 dark:border-orange-800',
      badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
    },
    red: { 
      bg: 'bg-red-100 dark:bg-red-900/30', 
      text: 'text-red-600 dark:text-red-400', 
      border: 'border-red-200 dark:border-red-800',
      badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
    },
    purple: { 
      bg: 'bg-purple-100 dark:bg-purple-900/30', 
      text: 'text-purple-600 dark:text-purple-400', 
      border: 'border-purple-200 dark:border-purple-800',
      badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
    },
    pink: { 
      bg: 'bg-pink-100 dark:bg-pink-900/30', 
      text: 'text-pink-600 dark:text-pink-400', 
      border: 'border-pink-200 dark:border-pink-800',
      badge: 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300'
    },
  };
  return map[color]?.[variant] || map.gray[variant];
}