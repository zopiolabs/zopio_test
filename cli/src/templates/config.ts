interface ConfigOptions {
  projectName?: string;
}

export default function configTemplate(options: ConfigOptions = {}): string {
  const { projectName = 'zopio-app' } = options;
  
  return `// Zopio Configuration File
export default {
  // Project information
  project: {
    name: "${projectName}",
    version: "0.1.0"
  },
  
  // Internationalization settings
  i18n: {
    defaultLocale: "en",
    locales: ["en", "tr", "es", "de"],
    localeDetection: true,
    // Directories where translation files are stored
    directories: {
      dictionaries: "dictionaries", // For next-international
      locales: "locales"            // For next-intl
    }
  },
  
  // Build settings
  build: {
    target: "es2020",
    minify: true,
    sourcemap: true
  },
  
  // Plugin settings
  plugins: []
};
`
}
