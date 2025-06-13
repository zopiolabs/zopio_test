import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";
import { logger, isZopioProject } from "../utils/helpers";
import configTemplate from "../templates/config";

interface ConfigCommandOptions {
  init?: boolean;
  get?: string;
  set?: string;
}

export const configCommand = new Command("config")
  .description("Manage Zopio project configuration")
  .option("-i, --init", "Initialize configuration file")
  .option("-g, --get <key>", "Get configuration value")
  .option("-s, --set <key=value>", "Set configuration value")
  .action(async (options: ConfigCommandOptions) => {
    const cwd = process.cwd();
    const configPath = path.join(cwd, "zopio.config.js");
    
    if (options.init) {
      if (fs.existsSync(configPath)) {
        logger.warning("Configuration file already exists.");
        return;
      }
      
      // Get project name from package.json if available
      let projectName = "zopio-app";
      const packageJsonPath = path.join(cwd, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          projectName = packageJson.name || projectName;
        } catch (error) {
          // Ignore errors, use default name
        }
      }
      
      // Create config file
      fs.writeFileSync(configPath, configTemplate({ projectName }));
      logger.success("Created configuration file: zopio.config.js");
      return;
    }
    
    // Check if project has config file
    if (!fs.existsSync(configPath)) {
      logger.warning("No configuration file found.");
      logger.info("Run 'zopio config --init' to create one.");
      return;
    }
    
    if (options.get) {
      logger.info(`Getting configuration value for: ${options.get}`);
      logger.warning("This feature is not yet implemented.");
      // Implementation would require dynamic import and property path resolution
      return;
    }
    
    if (options.set) {
      logger.info(`Setting configuration value: ${options.set}`);
      logger.warning("This feature is not yet implemented.");
      // Implementation would require parsing the config file, updating it, and writing it back
      return;
    }
    
    // If no options provided, show help
    configCommand.help();
  });
