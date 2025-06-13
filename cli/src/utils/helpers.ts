import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Log messages with consistent styling
 */
export const logger = {
  info: (message: string): void => console.log(chalk.blue('ℹ'), message),
  success: (message: string): void => console.log(chalk.green('✓'), message),
  warning: (message: string): void => console.log(chalk.yellow('⚠'), message),
  error: (message: string): void => console.log(chalk.red('✗'), message),
  title: (message: string): void => console.log(chalk.bold.cyan(`\n${message}\n`))
};

/**
 * Check if the current directory is a Zopio project
 */
export function isZopioProject(directory: string = process.cwd()): boolean {
  const packageJsonPath = path.join(directory, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return Boolean(packageJson.dependencies?.zopio || packageJson.devDependencies?.zopio);
  } catch (error) {
    return false;
  }
}

/**
 * Get the project configuration
 */
export async function getProjectConfig(directory: string = process.cwd()): Promise<any | null> {
  const configPath = path.join(directory, 'zopio.config.js');
  
  if (fs.existsSync(configPath)) {
    try {
      // Dynamic import for ESM compatibility
      return import(configPath);
    } catch (error) {
      logger.error(`Failed to load project configuration: ${(error as Error).message}`);
      return null;
    }
  }
  
  return null;
}

/**
 * Get i18n configuration
 */
export function getI18nConfig(directory: string = process.cwd()): { defaultLocale: string; locales: string[] } {
  const i18nConfigPath = path.join(directory, 'i18nConfig.ts');
  const languineJsonPath = path.join(directory, 'languine.json');
  
  if (fs.existsSync(i18nConfigPath)) {
    try {
      const content = fs.readFileSync(i18nConfigPath, 'utf8');
      // Simple regex to extract config object
      const match = content.match(/export\s+const\s+i18nConfig\s*=\s*({[\s\S]*?});/);
      if (match?.[1]) {
        // This is a simple parser, in a real implementation you'd want to use a proper TS parser
        return JSON.parse(match[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":'));
      }
    } catch (error) {
      logger.error(`Failed to parse i18nConfig.ts: ${(error as Error).message}`);
    }
  }
  
  if (fs.existsSync(languineJsonPath)) {
    try {
      return JSON.parse(fs.readFileSync(languineJsonPath, 'utf8'));
    } catch (error) {
      logger.error(`Failed to parse languine.json: ${(error as Error).message}`);
    }
  }
  
  // Default config based on memory
  return {
    defaultLocale: 'en',
    locales: ['en', 'tr', 'es', 'de']
  };
}

/**
 * Create a file with content
 */
export function createFile(filePath: string, content: string): boolean {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    return true;
  } catch (error) {
    logger.error(`Failed to create file ${filePath}: ${(error as Error).message}`);
    return false;
  }
}

/**
 * Get template content
 */
export function getTemplate(templateName: string): string | null {
  const templatesDir = path.join(__dirname, '..', '..', 'templates');
  const templatePath = path.join(templatesDir, `${templateName}.js`);
  
  if (fs.existsSync(templatePath)) {
    return fs.readFileSync(templatePath, 'utf8');
  }
  
  return null;
}
