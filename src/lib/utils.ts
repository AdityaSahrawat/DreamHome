import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date / time formatting helpers (consistency for UI)
export function formatDateTime(value: string | Date | null | undefined, locale: string = 'en-US') {
  if (!value) return '—';
  try {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return 'Invalid date';
    return d.toLocaleString(locale, {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return '—';
  }
}

export function formatDate(value: string | Date | null | undefined, locale: string = 'en-US') {
  if (!value) return '—';
  try {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return 'Invalid date';
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: '2-digit' });
  } catch {
    return '—';
  }
}