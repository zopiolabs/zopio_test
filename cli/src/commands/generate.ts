import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";
import { logger } from "../utils/helpers.js";

type ModuleType = "core" | "addon" | "data" | "i18n";

interface GenerateCommandOptions {
  directory: string;
}

export const generateCommand = new Command("generate")
  .description("Generate a new zopio module")
  .argument("<type>", "Type of module to generate (core | addon | data | i18n)")
  .argument("<n>", "Name of the module")
  .option("-d, --directory <directory>", "Custom directory for the module", "")
  .action((type: string, name: string, options: GenerateCommandOptions) => {
    // Validate module type
    const validTypes: ModuleType[] = ["core", "addon", "data", "i18n"];
    if (!validTypes.includes(type as ModuleType)) {
      logger.error(`Invalid module type: ${type}. Must be one of: ${validTypes.join(", ")}`);
      return;
    }

    // Determine base directory
    const baseDir = options.directory || `packages/${type}/${name}`;
    
    if (fs.existsSync(baseDir)) {
      logger.warning(`Module already exists at ${baseDir}.`);
      return;
    }
    
    // Create directory structure
    fs.mkdirSync(baseDir, { recursive: true });
    
    // Generate different content based on module type
    if (type === "i18n") {
      // Create i18n module with supported locales from memory
      const locales = ["en", "tr", "es", "de"];
      
      for (const locale of locales) {
        const localeDir = path.join(baseDir, locale);
        fs.mkdirSync(localeDir, { recursive: true });
        
        // Create a sample translation file
        fs.writeFileSync(
          path.join(localeDir, `${name}.json`),
          JSON.stringify({
            title: locale === "en" ? "Title" : 
                   locale === "tr" ? "Başlık" : 
                   locale === "es" ? "Título" : 
                   "Titel",
            description: locale === "en" ? "Description" : 
                         locale === "tr" ? "Açıklama" : 
                         locale === "es" ? "Descripción" : 
                         "Beschreibung"
          }, null, 2)
        );
      }
      
      logger.success(`Created i18n module '${name}' with translations for ${locales.join(", ")}`);
    } else {
      // Create standard module
      fs.writeFileSync(
        path.join(baseDir, "index.ts"),
        `// ${name} module for ${type}\nexport const ${name} = (): { name: string; type: string } => {\n  console.log("${name} module");\n  return { name: "${name}", type: "${type}" };\n};\n`
      );
      
      // Create package.json for the module
      fs.writeFileSync(
        path.join(baseDir, "package.json"),
        JSON.stringify({
          name: `@zopio/${type}-${name}`,
          version: "0.1.0",
          main: "index.js",
          type: "module"
        }, null, 2)
      );
      
      logger.success(`Created ${type} module '${name}' at ${baseDir}`);
    }
  });
