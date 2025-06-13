import { Command } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
// Use a dynamic import for the helpers module to avoid path issues
let logger;

// This will be initialized in the plugin function
const initLogger = async () => {
  try {
    // Using console.log temporarily until logger is initialized
    console.log('Initializing i18n-tools plugin...');
    
    // Simple logger implementation in case the import fails
    logger = {
      info: (msg) => console.log(`\x1b[36mINFO\x1b[0m: ${msg}`),
      success: (msg) => console.log(`\x1b[32mSUCCESS\x1b[0m: ${msg}`),
      error: (msg) => console.log(`\x1b[31mERROR\x1b[0m: ${msg}`),
      warn: (msg) => console.log(`\x1b[33mWARN\x1b[0m: ${msg}`)
    };
  } catch (error) {
    console.error('Failed to import logger:', error);
  }
};

/**
 * Advanced internationalization tools plugin for Zopio CLI
 * Provides additional functionality for working with translations
 */
export default async function initPlugin() {
  // Initialize the logger
  await initLogger();
  // Create a command for analyzing translation coverage
  const analyzeCommand = new Command('i18n-analyze')
    .description('Analyze translation coverage across locales')
    .option('-d, --directory <directory>', 'Directory containing translation files', 'dictionaries')
    .option('-b, --base <locale>', 'Base locale to compare against', 'en')
    .action((options) => {
      const cwd = process.cwd();
      const baseDir = path.join(cwd, options.directory);
      const baseLocale = options.base;
      
      if (!fs.existsSync(baseDir)) {
        logger.error(`Directory not found: ${options.directory}`);
        return;
      }
      
      // Get all locales
      const locales = fs.readdirSync(baseDir)
        .filter(file => fs.statSync(path.join(baseDir, file)).isDirectory());
      
      if (!locales.includes(baseLocale)) {
        logger.error(`Base locale '${baseLocale}' not found`);
        return;
      }
      
      logger.title('Translation Coverage Analysis');
      logger.info(`Base locale: ${baseLocale}`);
      
      // Get all translation files in base locale
      const baseLocaleDir = path.join(baseDir, baseLocale);
      const baseFiles = fs.readdirSync(baseLocaleDir)
        .filter(file => file.endsWith('.json'));
      
      if (baseFiles.length === 0) {
        logger.warning(`No translation files found in ${baseLocale}`);
        return;
      }
      
      // Analyze each locale
      for (const locale of locales) {
        if (locale === baseLocale) continue;
        
        const localeDir = path.join(baseDir, locale);
        logger.info(`\nAnalyzing ${locale}:`);
        
        let totalKeys = 0;
        let missingKeys = 0;
        
        // Check each file
        for (const file of baseFiles) {
          const baseFilePath = path.join(baseLocaleDir, file);
          const localeFilePath = path.join(localeDir, file);
          
          // Skip if locale doesn't have this file
          if (!fs.existsSync(localeFilePath)) {
            logger.warning(`  Missing file: ${file}`);
            continue;
          }
          
          try {
            const baseTranslations = JSON.parse(fs.readFileSync(baseFilePath, 'utf8'));
            const localeTranslations = JSON.parse(fs.readFileSync(localeFilePath, 'utf8'));
            
            // Count keys recursively
            const countKeys = (obj, prefix = '') => {
              let count = 0;
              let missing = 0;
              
              for (const key in obj) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                  const { keyCount, missingCount } = countKeys(obj[key], fullKey);
                  count += keyCount;
                  missing += missingCount;
                } else {
                  count++;
                  
                  // Check if key exists in locale
                  let current = localeTranslations;
                  const parts = fullKey.split('.');
                  let exists = true;
                  
                  for (const part of parts) {
                    if (!current || !current[part]) {
                      exists = false;
                      break;
                    }
                    current = current[part];
                  }
                  
                  if (!exists) {
                    missing++;
                  }
                }
              }
              
              return { keyCount: count, missingCount: missing };
            };
            
            const { keyCount, missingCount } = countKeys(baseTranslations);
            totalKeys += keyCount;
            missingKeys += missingCount;
            
            const coverage = ((keyCount - missingCount) / keyCount * 100).toFixed(1);
            logger.info(`  ${file}: ${coverage}% coverage (${keyCount - missingCount}/${keyCount} keys)`);
          } catch (error) {
            logger.error(`  Error analyzing ${file}: ${error.message}`);
          }
        }
        
        // Overall coverage
        if (totalKeys > 0) {
          const overallCoverage = ((totalKeys - missingKeys) / totalKeys * 100).toFixed(1);
          logger.info(`\n  Overall coverage for ${locale}: ${overallCoverage}% (${totalKeys - missingKeys}/${totalKeys} keys)`);
        }
      }
    });
  
  // Create a command for synchronizing translation keys
  const syncCommand = new Command('i18n-sync')
    .description('Synchronize translation keys across locales')
    .option('-d, --directory <directory>', 'Directory containing translation files', 'dictionaries')
    .option('-b, --base <locale>', 'Base locale to sync from', 'en')
    .option('-f, --file <file>', 'Specific file to synchronize (optional)')
    .option('--dry-run', 'Show what would be synchronized without making changes', false)
    .action((options) => {
      const cwd = process.cwd();
      const baseDir = path.join(cwd, options.directory);
      const baseLocale = options.base;
      const dryRun = options.dryRun;
      
      if (!fs.existsSync(baseDir)) {
        logger.error(`Directory not found: ${options.directory}`);
        return;
      }
      
      // Get all locales
      const locales = fs.readdirSync(baseDir)
        .filter(file => fs.statSync(path.join(baseDir, file)).isDirectory());
      
      if (!locales.includes(baseLocale)) {
        logger.error(`Base locale '${baseLocale}' not found`);
        return;
      }
      
      logger.title(`Translation Synchronization ${dryRun ? '(DRY RUN)' : ''}`);
      logger.info(`Base locale: ${baseLocale}`);
      
      // Get translation files
      const baseLocaleDir = path.join(baseDir, baseLocale);
      let baseFiles = fs.readdirSync(baseLocaleDir)
        .filter(file => file.endsWith('.json'));
      
      // Filter to specific file if provided
      if (options.file) {
        const fileName = options.file.endsWith('.json') ? options.file : `${options.file}.json`;
        if (baseFiles.includes(fileName)) {
          baseFiles = [fileName];
        } else {
          logger.error(`File not found in base locale: ${fileName}`);
          return;
        }
      }
      
      if (baseFiles.length === 0) {
        logger.warning(`No translation files found in ${baseLocale}`);
        return;
      }
      
      // Process each locale
      for (const locale of locales) {
        if (locale === baseLocale) continue;
        
        const localeDir = path.join(baseDir, locale);
        if (!fs.existsSync(localeDir)) {
          fs.mkdirSync(localeDir, { recursive: true });
        }
        
        logger.info(`\nSynchronizing ${locale}:`);
        
        // Process each file
        for (const file of baseFiles) {
          const baseFilePath = path.join(baseLocaleDir, file);
          const localeFilePath = path.join(localeDir, file);
          
          try {
            const baseTranslations = JSON.parse(fs.readFileSync(baseFilePath, 'utf8'));
            let localeTranslations = {};
            
            // Load existing translations if file exists
            if (fs.existsSync(localeFilePath)) {
              localeTranslations = JSON.parse(fs.readFileSync(localeFilePath, 'utf8'));
            }
            
            // Synchronize keys
            const syncKeys = (baseObj, localeObj, prefix = '') => {
              let changes = 0;
              const result = { ...localeObj };
              
              for (const key in baseObj) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                
                if (typeof baseObj[key] === 'object' && baseObj[key] !== null) {
                  // Handle nested objects
                  if (!result[key] || typeof result[key] !== 'object') {
                    result[key] = {};
                  }
                  
                  const { synced, changeCount } = syncKeys(baseObj[key], result[key], fullKey);
                  result[key] = synced;
                  changes += changeCount;
                } else if (!(key in result)) {
                  // Add missing key with empty value or base value as placeholder
                  result[key] = `[${baseObj[key]}]`; // Mark as untranslated
                  logger.info(`  Added missing key: ${fullKey}`);
                  changes++;
                }
              }
              
              return { synced: result, changeCount: changes };
            };
            
            const { synced, changeCount } = syncKeys(baseTranslations, localeTranslations);
            
            if (changeCount > 0) {
              logger.info(`  ${file}: Added ${changeCount} missing keys`);
              
              if (!dryRun) {
                fs.writeFileSync(localeFilePath, JSON.stringify(synced, null, 2));
              }
            } else {
              logger.info(`  ${file}: Already in sync`);
            }
          } catch (error) {
            logger.error(`  Error synchronizing ${file}: ${error.message}`);
          }
        }
      }
      
      if (dryRun) {
        logger.info('\nThis was a dry run. No files were modified.');
        logger.info('Run without --dry-run to apply changes.');
      }
    });
  
  // Return the commands provided by this plugin
  return [analyzeCommand, syncCommand];
}
