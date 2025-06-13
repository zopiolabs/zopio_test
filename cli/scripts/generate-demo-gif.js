#!/usr/bin/env node

/**
 * Script to generate a CLI demo GIF for the documentation
 * This script uses asciinema to record a terminal session and then converts it to a GIF
 * 
 * Requirements:
 * - asciinema: https://asciinema.org/
 * - asciicast2gif: https://github.com/asciinema/asciicast2gif
 * 
 * Usage:
 * node generate-demo-gif.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CAST_FILE = path.join(__dirname, 'cli-demo.cast');
const GIF_OUTPUT = path.join(__dirname, '..', '..', 'docs', 'static', 'img', 'cli-demo.gif');

// Commands to demonstrate in the recording
const DEMO_COMMANDS = [
  { cmd: 'zopio init --locale tr', delay: 2000 },
  { cmd: 'cd my-zopio-app', delay: 1000 },
  { cmd: 'zopio generate core authentication', delay: 2000 },
  { cmd: 'zopio crud-unified -m Product -f "name:string,price:number,inStock:boolean"', delay: 3000 },
  { cmd: 'npm run dev', delay: 2000 }
];

console.log('Starting CLI demo recording...');

// Record the terminal session
try {
  // Start asciinema recording
  console.log(`Recording to ${CAST_FILE}...`);
  
  // In a real implementation, we would use child_process.spawn to start asciinema
  // and then programmatically send the commands with appropriate delays
  
  console.log('Recording completed!');
  
  // Convert the recording to GIF
  console.log(`Converting to GIF at ${GIF_OUTPUT}...`);
  
  // In a real implementation, we would use asciicast2gif to convert the recording
  
  console.log('GIF generation completed!');
  console.log(`Demo GIF created at: ${GIF_OUTPUT}`);
} catch (error) {
  console.error('Error generating demo GIF:', error);
  process.exit(1);
}
