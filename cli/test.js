#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

// Create a temporary directory for testing
const TEST_DIR = path.join(process.cwd(), 'test-project');

// Helper functions
const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  error: (msg) => console.log(chalk.red('✗'), msg),
  title: (msg) => console.log(chalk.bold.cyan(`\n${msg}\n`))
};

function runCommand(command) {
  try {
    log.info(`Running: ${command}`);
    const output = execSync(command, { cwd: TEST_DIR, encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    log.error(`Command failed: ${command}`);
    log.error(error.message);
    return null;
  }
}

function cleanup() {
  log.info('Cleaning up test directory...');
  try {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  } catch (error) {
    log.error(`Failed to clean up: ${error.message}`);
  }
}

// Start tests
async function runTests() {
  log.title('ZOPIO CLI TEST SUITE');
  
  // Clean up any previous test directory
  cleanup();
  
  // Create test directory
  log.info('Creating test directory...');
  fs.mkdirSync(TEST_DIR, { recursive: true });
  
  // Test init command
  log.title('Testing init command');
  const initOutput = runCommand('node ../zopio.js init');
  
  if (initOutput && initOutput.includes('Initialized zopio project')) {
    log.success('Init command successful');
  } else {
    log.error('Init command failed');
    cleanup();
    process.exit(1);
  }
  
  // Verify package.json was created
  if (fs.existsSync(path.join(TEST_DIR, 'package.json'))) {
    log.success('package.json created');
  } else {
    log.error('package.json not created');
    cleanup();
    process.exit(1);
  }
  
  // Test i18n command
  log.title('Testing i18n command');
  const i18nListOutput = runCommand('node ../zopio.js i18n --list');
  
  if (i18nListOutput && i18nListOutput.includes('Available Locales')) {
    log.success('i18n list command successful');
  } else {
    log.error('i18n list command failed');
  }
  
  // Test config command
  log.title('Testing config command');
  const configOutput = runCommand('node ../zopio.js config --init');
  
  if (configOutput && configOutput.includes('Created configuration file')) {
    log.success('config init command successful');
  } else {
    log.error('config init command failed');
  }
  
  // Test component command
  log.title('Testing component command');
  const componentOutput = runCommand('node ../zopio.js component TestComponent --i18n');
  
  if (componentOutput && componentOutput.includes('Created component')) {
    log.success('component command successful');
  } else {
    log.error('component command failed');
  }
  
  // Test generate command
  log.title('Testing generate command');
  const generateOutput = runCommand('node ../zopio.js generate i18n test-namespace');
  
  if (generateOutput && generateOutput.includes('Created i18n module')) {
    log.success('generate i18n command successful');
  } else {
    log.error('generate i18n command failed');
  }
  
  // All tests complete
  log.title('TEST SUMMARY');
  log.success('All tests completed');
  
  // Clean up
  cleanup();
}

// Run the tests
runTests().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  cleanup();
  process.exit(1);
});
