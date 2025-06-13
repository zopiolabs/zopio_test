import { useCallback } from 'react';
import type { TranslationValues } from 'next-intl';
import enTranslations from './en';
import trTranslations from './tr';
import esTranslations from './es';
import deTranslations from './de';

type TranslationFunction = (key: string, values?: TranslationValues) => string;
type NextIntlTranslation = { t: TranslationFunction } & Record<string, unknown>;

// Import from the project's i18n configuration if available
let nextIntlUseTranslation: ((namespace: string) => NextIntlTranslation) | undefined;
try {
  // Try to use the project's internationalization setup
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  nextIntlUseTranslation = require('next-intl/client').useTranslation as ((namespace: string) => NextIntlTranslation);
} catch (e) {
  // Fallback to our simple implementation if next-intl is not available
  nextIntlUseTranslation = undefined;
}

type TranslationsType = Record<string, Record<string, unknown>>;

const translations: TranslationsType = {
  en: enTranslations,
  tr: trTranslations,
  es: esTranslations,
  de: deTranslations,
};

// Get nested value from object using path like 'form.validation.required'
const getNestedValue = (obj: Record<string, unknown>, path: string, params?: Record<string, unknown>): string => {
  const value = path.split('.').reduce<unknown>(
    (o, i) => (o && typeof o === 'object' && i in o ? (o as Record<string, unknown>)[i] : undefined), 
    obj
  );
  
  if (typeof value !== 'string') return path;
  
  // Replace parameters like {{param}} with actual values
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const paramValue = params[key];
      return paramValue !== undefined ? String(paramValue) : `{{${key}}}`;
    });
  }
  
  return value;
};

// Fallback implementation if next-intl is not available
const createFallbackTranslation = (locale = 'en'): TranslationFunction => {
  return (key: string, params?: Record<string, unknown>): string => {
    const localeTranslations = translations[locale] || translations.en;
    return getNestedValue(localeTranslations, key, params) || key;
  };
};

// Custom hook that works with next-intl or falls back to our implementation
export const useCrudTranslation = (namespace = 'crud'): { t: TranslationFunction } => {
  // If next-intl is available, use it
  if (nextIntlUseTranslation) {
    return nextIntlUseTranslation(namespace);
  }
  
  // Otherwise use our fallback implementation
  // In a real app, you might want to get the locale from a context or config
  const locale = typeof window !== 'undefined' ? 
    (localStorage.getItem('locale') || navigator.language.split('-')[0]) : 'en';
  
  const t = useCallback(
    (key: string, params?: Record<string, unknown>) => createFallbackTranslation(locale)(key, params),
    [locale]
  );
  
  return { t };
};

// Export the translations for direct use if needed
export { translations };

// Type for translation objects
export type TranslationObject = typeof enTranslations;
