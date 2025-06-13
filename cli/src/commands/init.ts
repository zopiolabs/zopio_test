import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";
import { logger } from "../utils/helpers.js";

interface InitCommandOptions {
  template: string;
  locale: string;
}

export const initCommand = new Command("init")
  .description("Initialize a new zopio project")
  .option("-t, --template <template>", "Template to use for initialization", "default")
  .option("-l, --locale <locale>", "Default locale for internationalization", "en")
  .action((options: InitCommandOptions) => {
    const cwd = process.cwd();
    const pkg = path.join(cwd, "package.json");
    
    if (fs.existsSync(pkg)) {
      logger.warning("A project already exists here.");
      return;
    }
    
    const packageJson = {
      name: "zopio-app",
      version: "0.1.0",
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start"
      },
      dependencies: {
        "next": "^14.0.0",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "zopio": "latest",
        "next-international": "^1.1.0",
        "next-intl": "^3.0.0"
      }
    };
    
    fs.writeFileSync(pkg, JSON.stringify(packageJson, null, 2));
    
    // Create basic project structure
    const directories = ["app", "components", "lib", "dictionaries"];
    for (const dir of directories) {
      if (!fs.existsSync(path.join(cwd, dir))) {
        fs.mkdirSync(path.join(cwd, dir), { recursive: true });
      }
    }
    
    // Create i18n config based on memory
    const i18nConfig = {
      defaultLocale: options.locale,
      locales: ["en", "tr", "es", "de"], // Using supported locales from memory
      localeDetection: true
    };
    
    fs.writeFileSync(
      path.join(cwd, "i18nConfig.ts"), 
      `export const i18nConfig = ${JSON.stringify(i18nConfig, null, 2)};`
    );
    
    logger.success(`Initialized zopio project with ${options.template} template and ${options.locale} locale.`);
  });
