# Zopio CLI Reference

A comprehensive guide to using the Zopio CLI for developers. The CLI is now implemented in TypeScript for better type safety and developer experience.

## Table of Contents

- [Installation](#installation)
- [Core Commands](#core-commands)
  - [init](#init)
  - [generate](#generate)
  - [component](#component)
  - [i18n](#i18n)
  - [config](#config)
  - [jobs](#jobs)
  - [plugins](#plugins)
- [CRUD Commands](#crud-commands)
  - [crud](#crud)
  - [crud-schema](#crud-schema)
  - [crud-ui](#crud-ui)
  - [crud-permissions](#crud-permissions)
  - [crud-validation](#crud-validation)
  - [crud-testing](#crud-testing)
  - [crud-unified](#crud-unified)
- [Data Management](#data-management)
  - [data-provider](#data-provider)
- [Internationalization](#internationalization)
- [Plugin System](#plugin-system)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)

## Installation

The Zopio CLI is now implemented in TypeScript, providing better type safety and developer experience.

```bash
# Install globally
npm install -g zopio-cli

# Or use with npx
npx zopio-cli [command]
```

### For Developers

If you're developing or extending the CLI:

```bash
# Clone the repository
git clone https://github.com/your-org/zopio-cli.git
cd zopio-cli

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the CLI
npm run build
```

## Core Commands

### init

Initialize a new Zopio project with the default structure.

```bash
zopio init [options]
```

Options:

- `-t, --template <template>` - Template to use (default: "default")
- `-l, --locale <locale>` - Default locale for internationalization (default: "en")

Example:

```bash
zopio init --locale tr
```

### generate

Generate a new Zopio module.

```bash
zopio generate <type> <name> [options]
```

Arguments:

- `type` - Type of module to generate (core | addon | data | i18n)
- `name` - Name of the module

Options:

- `-d, --directory <directory>` - Custom directory for the module

Example:

```bash
zopio generate i18n user-messages
zopio generate core auth
```

### component

Generate a new React component with optional internationalization support.

```bash
zopio component <name> [options]
```

Arguments:

- `name` - Component name

Options:

- `-i, --i18n` - Add internationalization support
- `-p, --path <path>` - Custom path for the component (default: "components")

Example:

```bash
zopio component UserProfile --i18n
```

### i18n

Manage internationalization for your Zopio project.

```bash
zopio i18n [options]
```

Options:

- `-a, --add <locale>` - Add a new locale
- `-l, --list` - List all available locales
- `-e, --extract` - Extract translation keys from project
- `-c, --create <namespace>` - Create a new translation namespace

Example:

```bash
zopio i18n --list
zopio i18n --add fr
zopio i18n --create user-profile
```

### config

Manage Zopio project configuration.

```bash
zopio config [options]
```

Options:

- `-i, --init` - Initialize configuration file
- `-g, --get <key>` - Get configuration value
- `-s, --set <key=value>` - Set configuration value

Example:

```bash
zopio config --init
```

### jobs

Manage background jobs and triggers.

```bash
zopio jobs [options]
```

Options:

- `-l, --list` - List all registered jobs
- `-c, --create <name>` - Create a new job
- `-t, --trigger <jobId>` - Manually trigger a job
- `-s, --schedule <cron>` - Set job schedule (cron expression)

Example:

```bash
zopio jobs --create user-notifications
```

### plugins

Manage CLI plugins.

```bash
zopio plugins [options]
```

Options:

- `-l, --list` - List all installed plugins
- `-i, --install <name>` - Install a plugin

Example:

```bash
zopio plugins --list
```

## CRUD Commands

### crud

The `crud` command generates CRUD (Create, Read, Update, Delete) operations for a model.

```bash
zopio crud --model <name> --fields <fields> [options]
```

Options:

- `--model, -m <name>`: Model name (required)
- `--fields, -f <fields>`: Fields in format "name:type,age:number"
- `--output, -o <directory>`: Output directory for generated files
- `--api-only`: Generate only API endpoints
- `--ui-only`: Generate only UI components
- `--all`: Generate both API endpoints and UI components (default)

Example:

```bash
zopio crud --model User --fields "name:string,email:string,age:number,isActive:boolean"
```

### crud-schema

The `crud-schema` command generates JSON schema and TypeScript interface for a model.

```bash
zopio crud-schema --model <name> --fields <fields> [options]
```

Options:

- `--model, -m <name>`: Model name (required)
- `--fields, -f <fields>`: Fields in format "name:type,age:number"
- `--output, -o <directory>`: Output directory for schema files

Example:

```bash
zopio crud-schema --model Product --fields "name:string,price:number,description:string,inStock:boolean"
```

### crud-ui

The `crud-ui` command generates React components for CRUD operations.

```bash
zopio crud-ui --model <name> --fields <fields> [options]
```

Options:

- `--model, -m <name>`: Model name (required)
- `--fields, -f <fields>`: Fields in format "name:type:label,age:number:Age"
- `--output, -o <directory>`: Output directory for UI components
- `--theme, -t <theme>`: UI theme (bootstrap, material) (default: bootstrap)

Example:

```bash
zopio crud-ui --model Customer --fields "name:string:Full Name,email:string:Email Address,joinDate:date:Join Date"
```

### crud-permissions

The `crud-permissions` command generates permissions configuration and middleware for a model.

```bash
zopio crud-permissions --model <name> --roles <roles> [options]
```

Options:

- `--model, -m <name>`: Model name (required)
- `--roles, -r <roles>`: Roles and permissions in format "admin:all,user:read,editor:read,write"
- `--output, -o <directory>`: Output directory for permissions files

Example:

```bash
zopio crud-permissions --model Customer --roles "admin:all,user:read,editor:read,write"
```

### crud-validation

The `crud-validation` command generates validation schemas for a model using popular validation libraries.

```bash
zopio crud-validation --model <name> --fields <fields> [options]
```

Options:

- `--model, -m <name>`: Model name (required)
- `--fields, -f <fields>`: Fields in format "name:type:validations,age:number:required|min=18"
- `--output, -o <directory>`: Output directory for validation schemas
- `--library, -l <library>`: Validation library (yup, zod, class-validator) (default: zod)

Example:

```bash
zopio crud-validation --model Customer --fields "name:string:required,email:string:required|pattern=^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$,age:number:min=18|max=100"
```

### crud-testing

The `crud-testing` command generates tests for CRUD operations, including API endpoint tests and UI component tests.

```bash
zopio crud-testing --model <name> --fields <fields> [options]
```

Options:

- `--model, -m <name>`: Model name (required)
- `--fields, -f <fields>`: Fields in format "name:type:example,age:number:30"
- `--output, -o <directory>`: Output directory for tests
- `--framework, -fw <framework>`: Testing framework (jest, vitest) (default: jest)
- `--api`: Generate API tests only
- `--ui`: Generate UI component tests only

Example:

```bash
zopio crud-testing --model Customer --fields "name:string:John Doe,email:string:john@example.com,age:number:35"
```

### crud-unified

The `crud-unified` command generates a complete CRUD setup for a model, combining all the CRUD commands.

```bash
zopio crud-unified --model <name> --fields <fields> [options]
```

Options:

- `--model, -m <name>`: Model name (required)
- `--fields, -f <fields>`: Fields in format "name:type:label,age:number:Age"
- `--output, -o <directory>`: Output directory for generated files
- `--api`: Generate API endpoints
- `--ui`: Generate UI components
- `--schema`: Generate JSON schema and TypeScript interface
- `--permissions`: Generate permissions configuration and middleware
- `--roles, -r <roles>`: Roles and permissions in format "admin:all,user:read,editor:read,write"
- `--theme, -t <theme>`: UI theme (bootstrap, material) (default: bootstrap)

Example:

```bash
zopio crud-unified --model Order --fields "id:string,customer:string,total:number,date:date,status:string" --api --ui --schema --permissions
```

## Data Management

### data-provider

The `data-provider` command generates data providers for your Zopio project.

```bash
zopio data-provider --type <type> --name <name> [options]
```

Options:

- `--type, -t <type>`: Type of data provider (rest, graphql, mock)
- `--name, -n <name>`: Name of the data provider
- `--endpoint, -e <url>`: API endpoint URL

Example:

```bash
zopio data-provider --type rest --name api --endpoint "https://api.example.com"
```

## Internationalization

The Zopio CLI provides comprehensive support for internationalization based on the project's requirements:

### Supported Locales

- English (en)
- Turkish (tr)
- Spanish (es)
- German (de)

### Default Locale

English (en) is the default locale, but this can be changed during project initialization or in the configuration.

### Framework Integration

The CLI integrates with both next-international (for middleware) and next-intl (for client-side translations).

### Translation Files

Translation files are stored in two locations:

- `dictionaries/` - For next-international
- `locales/` - For next-intl

### Configuration Files

- `i18nConfig.ts` - Main configuration file
- `languine.json` - Additional configuration

### Plugin Commands

The i18n-tools plugin provides additional commands:

```bash
# Analyze translation coverage
zopio i18n-analyze [options]

# Synchronize translation keys
zopio i18n-sync [options]
```

## Plugin System

The Zopio CLI includes a powerful plugin system that allows extending its functionality.

### Plugin Locations

Plugins can be installed in the following locations:

- Project-specific: `<project>/.zopio/plugins/`
- User-specific: `$HOME/.zopio/plugins/`
- Built-in: `<cli-directory>/plugins/`

### Creating Plugins

A plugin is a JavaScript module that exports a default function which returns an array of commander Command objects.

Example plugin structure:

```javascript
import { Command } from 'commander';

export default function initPlugin() {
  const command = new Command('example')
    .description('Example command')
    .action(() => {
      console.log('Example command executed');
    });
  
  return [command];
}
```

## Advanced Usage

### Using Environment Variables

The CLI respects the following environment variables:

- `ZOPIO_CONFIG_PATH` - Custom path to the configuration file
- `ZOPIO_LOCALE` - Override the default locale

### Creating Custom Templates

You can create custom templates for code generation by adding files to:

- `<project>/.zopio/templates/`
- `$HOME/.zopio/templates/`

## Troubleshooting

### Common Issues

#### Command Not Found

If the `zopio` command is not found, ensure it's installed globally or use `npx zopio-cli`.

#### Internationalization Issues

If you encounter issues with internationalization:

1. Check that your locale files exist in both `dictionaries/` and `locales/` directories
2. Verify that the locale is included in `i18nConfig.ts`
3. Run `zopio i18n-sync` to synchronize missing translation keys

#### Plugin Loading Failures

If plugins fail to load:

1. Check that the plugin file exports a default function
2. Verify that the plugin returns an array of Command objects
3. Check for syntax errors in the plugin file
