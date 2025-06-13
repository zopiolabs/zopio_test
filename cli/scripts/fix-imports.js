#!/usr/bin/env node

/**
 * Script to convert CommonJS require statements to ES module imports
 * in the CLI command files.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const commandsDir = path.join(__dirname, '..', 'src', 'commands');
const mainFile = path.join(__dirname, '..', 'src', 'zopio.ts');

async function updateFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Replace CommonJS require with ES module import
    const updatedContent = content.replace(
      /\/\/ Use CommonJS require for commander to avoid TypeScript issues\n\/\/ @ts-ignore\nconst { Command } = require\('commander'\);/g,
      "// Use ES module import for commander\nimport { Command } from 'commander';"
    );
    
    if (content !== updatedContent) {
      await writeFile(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error);
    return false;
  }
}

async function updateMainFile() {
  try {
    const content = await readFile(mainFile, 'utf8');
    
    // Replace CommonJS require with ES module import in main file
    const updatedContent = content.replace(
      /\/\/ Use a CommonJS require for commander to avoid TypeScript issues\n\/\/ @ts-ignore\nconst { Command } = require\("commander"\);/g,
      "// Use ES module import for commander\nimport { Command } from 'commander';"
    );
    
    if (content !== updatedContent) {
      await writeFile(mainFile, updatedContent, 'utf8');
      console.log(`✅ Updated main file: ${path.relative(process.cwd(), mainFile)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error updating main file:`, error);
    return false;
  }
}

async function main() {
  console.log('🔍 Converting CommonJS requires to ES module imports...');
  
  // Update the main zopio.ts file
  await updateMainFile();
  
  // Get all command files
  const files = fs.readdirSync(commandsDir)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.join(commandsDir, file));
  
  let updatedCount = 0;
  
  // Update each command file
  for (const file of files) {
    const updated = await updateFile(file);
    if (updated) updatedCount++;
  }
  
  console.log(`\n✨ Done! Updated ${updatedCount} command files.`);
}

main().catch(console.error);
