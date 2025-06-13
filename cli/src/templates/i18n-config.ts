interface I18nConfigOptions {
  defaultLocale?: string;
  locales?: string[];
}

export default function i18nConfigTemplate(options: I18nConfigOptions = {}): string {
  const { defaultLocale = 'en', locales = ['en', 'tr', 'es', 'de'] } = options;
  
  return `export const i18nConfig = {
  defaultLocale: '${defaultLocale}',
  locales: ${JSON.stringify(locales)},
  localeDetection: true
};
`;
}
