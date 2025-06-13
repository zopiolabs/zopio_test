// Use ES module import for commander
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { logger, isZopioProject } from '../utils/helpers';

interface CrudValidationCommandOptions {
  model?: string;
  fields?: string;
  output?: string;
  library?: string;
}

/**
 * Parse fields string into an array of field objects
 * @param fieldsStr Fields string in format "name:type,age:number"
 * @returns Array of field objects
 */
function parseFields(fieldsStr: string): Array<{ name: string; type: string; required?: boolean; min?: number; max?: number; pattern?: string }> {
  if (!fieldsStr) return [];
  
  return fieldsStr.split(',').map(field => {
    const parts = field.trim().split(':');
    const name = parts[0].trim();
    const type = parts[1]?.trim() || 'string';
    
    // Parse validation rules if provided
    const validationRules: { required?: boolean; min?: number; max?: number; pattern?: string } = {};
    
    if (parts[2]) {
      const rules = parts[2].split('|');
      
      for (const rule of rules) {
        if (rule === 'required') {
          validationRules.required = true;
        } else if (rule.startsWith('min=')) {
          validationRules.min = Number.parseInt(rule.split('=')[1], 10);
        } else if (rule.startsWith('max=')) {
          validationRules.max = Number.parseInt(rule.split('=')[1], 10);
        } else if (rule.startsWith('pattern=')) {
          validationRules.pattern = rule.split('=')[1];
        }
      }
    }
    
    return { 
      name, 
      type,
      ...validationRules
    };
  });
}

/**
 * Generate Yup validation schema
 * @param model Model name
 * @param fields Array of field objects
 * @returns Yup validation schema as a string
 */
function generateYupSchema(model: string, fields: Array<{ name: string; type: string; required?: boolean; min?: number; max?: number; pattern?: string }>): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);
  
  // Generate validation rules for each field
  const validationRules = fields.map(field => {
    const validations: string[] = [];
    
    // Set the appropriate Yup type
    const yupType = (() => {
      switch (field.type.toLowerCase()) {
        case 'string':
          return 'string()';
        case 'number':
        case 'integer':
          return 'number()';
        case 'boolean':
          return 'boolean()';
        case 'date':
          return 'date()';
        case 'array':
          return 'array()';
        case 'object':
          return 'object()';
        default:
          return 'string()';
      }
    })();
    
    // Add validation rules
    if (field.required) {
      validations.push('required()');
    }
    
    if (field.min !== undefined) {
      if (field.type === 'string') {
        validations.push(`min(${field.min}, 'Must be at least ${field.min} characters')`);
      } else if (field.type === 'number' || field.type === 'integer') {
        validations.push(`min(${field.min}, 'Must be at least ${field.min}')`);
      } else if (field.type === 'array') {
        validations.push(`min(${field.min}, 'Must have at least ${field.min} items')`);
      }
    }
    
    if (field.max !== undefined) {
      if (field.type === 'string') {
        validations.push(`max(${field.max}, 'Must be at most ${field.max} characters')`);
      } else if (field.type === 'number' || field.type === 'integer') {
        validations.push(`max(${field.max}, 'Must be at most ${field.max}')`);
      } else if (field.type === 'array') {
        validations.push(`max(${field.max}, 'Must have at most ${field.max} items')`);
      }
    }
    
    if (field.pattern) {
      validations.push(`matches(/${field.pattern}/, 'Invalid format')`);
    }
    
    // Combine type and validations
    const validationParts = ['yup', yupType];
    validationParts.push(...validations);
    const fullValidation = validationParts.join('.');
    
    return `  ${field.name}: ${fullValidation}`;
  }).join(',\n');
  
  return `import * as yup from 'yup';

/**
 * ${modelName} Validation Schema
 */
export const ${modelName}ValidationSchema = yup.object().shape({
${validationRules}
});
`;
}

/**
 * Generate Zod validation schema
 * @param model Model name
 * @param fields Array of field objects
 * @returns Zod validation schema as a string
 */
function generateZodSchema(model: string, fields: Array<{ name: string; type: string; required?: boolean; min?: number; max?: number; pattern?: string }>): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);
  
  // Generate validation rules for each field
  const validationRules = fields.map(field => {
    const validations: string[] = [];
    
    // Set the appropriate Zod type
    const zodType = (() => {
      switch (field.type.toLowerCase()) {
        case 'string':
          return 'z.string()';
        case 'number':
        case 'integer':
          return 'z.number()';
        case 'boolean':
          return 'z.boolean()';
        case 'date':
          return 'z.date()';
        case 'array':
          return 'z.array(z.any())';
        case 'object':
          return 'z.object({})';
        default:
          return 'z.string()';
      }
    })();
    
    // Add validation rules
    if (!field.required) {
      validations.push('optional()');
    }
    
    if (field.min !== undefined) {
      if (field.type === 'string') {
        validations.push(`min(${field.min}, { message: 'Must be at least ${field.min} characters' })`);
      } else if (field.type === 'number' || field.type === 'integer') {
        validations.push(`min(${field.min}, { message: 'Must be at least ${field.min}' })`);
      } else if (field.type === 'array') {
        validations.push(`min(${field.min}, { message: 'Must have at least ${field.min} items' })`);
      }
    }
    
    if (field.max !== undefined) {
      if (field.type === 'string') {
        validations.push(`max(${field.max}, { message: 'Must be at most ${field.max} characters' })`);
      } else if (field.type === 'number' || field.type === 'integer') {
        validations.push(`max(${field.max}, { message: 'Must be at most ${field.max}' })`);
      } else if (field.type === 'array') {
        validations.push(`max(${field.max}, { message: 'Must have at most ${field.max} items' })`);
      }
    }
    
    if (field.pattern) {
      validations.push(`regex(/${field.pattern}/, { message: 'Invalid format' })`);
    }
    
    // Combine type and validations
    const fullValidation = [zodType, ...validations].join('.');
    
    return `  ${field.name}: ${fullValidation}`;
  }).join(',\n');
  
  return `import { z } from 'zod';

/**
 * ${modelName} Validation Schema
 */
export const ${modelName}ValidationSchema = z.object({
${validationRules}
});

/**
 * ${modelName} Type
 */
export type ${modelName}Type = z.infer<typeof ${modelName}ValidationSchema>;
`;
}

/**
 * Generate class-validator decorators
 * @param model Model name
 * @param fields Array of field objects
 * @returns Class with validation decorators as a string
 */
function generateClassValidators(model: string, fields: Array<{ name: string; type: string; required?: boolean; min?: number; max?: number; pattern?: string }>): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);
  
  // Generate imports
  const imports = new Set<string>();
  imports.add('IsNotEmpty');
  imports.add('IsOptional');
  
  for (const field of fields) {
    switch (field.type.toLowerCase()) {
      case 'string':
        imports.add('IsString');
        if (field.min !== undefined) imports.add('MinLength');
        if (field.max !== undefined) imports.add('MaxLength');
        if (field.pattern) imports.add('Matches');
        break;
      case 'number':
      case 'integer':
        imports.add('IsNumber');
        if (field.min !== undefined) imports.add('Min');
        if (field.max !== undefined) imports.add('Max');
        break;
      case 'boolean':
        imports.add('IsBoolean');
        break;
      case 'date':
        imports.add('IsDate');
        break;
      case 'array':
        imports.add('IsArray');
        if (field.min !== undefined) imports.add('ArrayMinSize');
        if (field.max !== undefined) imports.add('ArrayMaxSize');
        break;
      case 'object':
        imports.add('IsObject');
        break;
      default:
        imports.add('IsString');
    }
  }
  
  const importStatement = `import { ${Array.from(imports).join(', ')} } from 'class-validator';`;
  
  // Generate class properties with decorators
  const classProperties = fields.map(field => {
    const decorators: string[] = [];
    
    // Type decorators
    switch (field.type.toLowerCase()) {
      case 'string':
        decorators.push('@IsString()');
        break;
      case 'number':
      case 'integer':
        decorators.push('@IsNumber()');
        break;
      case 'boolean':
        decorators.push('@IsBoolean()');
        break;
      case 'date':
        decorators.push('@IsDate()');
        break;
      case 'array':
        decorators.push('@IsArray()');
        break;
      case 'object':
        decorators.push('@IsObject()');
        break;
      default:
        decorators.push('@IsString()');
    }
    
    // Required/optional decorators
    if (field.required) {
      decorators.push('@IsNotEmpty({ message: "This field is required" })');
    } else {
      decorators.push('@IsOptional()');
    }
    
    if (field.min !== undefined) {
      if (field.type === 'string') {
        const minLengthDecorator = `@MinLength(${field.min}, { message: "Must be at least ${field.min} characters" })`;
        decorators.push(minLengthDecorator);
      } else if (field.type === 'number' || field.type === 'integer') {
        const minDecorator = `@Min(${field.min}, { message: "Must be at least ${field.min}" })`;
        decorators.push(minDecorator);
      } else if (field.type === 'array') {
        const minSizeDecorator = `@ArrayMinSize(${field.min}, { message: "Must have at least ${field.min} items" })`;
        decorators.push(minSizeDecorator);
      }
    }
    
    if (field.max !== undefined) {
      if (field.type === 'string') {
        const maxLengthDecorator = `@MaxLength(${field.max}, { message: "Must be at most ${field.max} characters" })`;
        decorators.push(maxLengthDecorator);
      } else if (field.type === 'number' || field.type === 'integer') {
        const maxDecorator = `@Max(${field.max}, { message: "Must be at most ${field.max}" })`;
        decorators.push(maxDecorator);
      } else if (field.type === 'array') {
        const maxSizeDecorator = `@ArrayMaxSize(${field.max}, { message: "Must have at most ${field.max} items" })`;
        decorators.push(maxSizeDecorator);
      }
    }
    
    if (field.pattern) {
      const matchesDecorator = `@Matches(/${field.pattern}/, { message: "Invalid format" })`;
      decorators.push(matchesDecorator);
    }
    
    return `  ${decorators.join('\n  ')}\n  ${field.name}: ${mapTypeToTypeScript(field.type)};`;
  }).join('\n\n');
  
  return `${importStatement}

/**
 * ${modelName} DTO with validation decorators
 */
export class ${modelName}Dto {
${classProperties}
}
`;
}

/**
 * Map field type to TypeScript type
 * @param type Field type
 * @returns TypeScript type
 */
function mapTypeToTypeScript(type: string): string {
  switch (type.toLowerCase()) {
    case 'string':
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'Date';
    case 'array':
      return 'any[]';
    case 'object':
      return 'Record<string, any>';
    default:
      return 'string';
  }
}

/**
 * Command to generate validation schemas for a model
 */
// @ts-ignore: Command is imported as a type but used as a value
export const crudValidationCommand = new Command('crud-validation')
  .description('Generate validation schemas for a model')
  .option('-m, --model <name>', 'Model name')
  .option('-f, --fields <fields>', 'Fields in format "name:type:validations,age:number:required|min=18"')
  .option('-o, --output <directory>', 'Output directory for validation schemas')
  .option('-l, --library <library>', 'Validation library (yup, zod, class-validator)', 'zod')
  .action((options: CrudValidationCommandOptions) => {
    // Check if running in a Zopio project
    if (!isZopioProject()) {
      logger.error('Not a Zopio project. Please run this command in a Zopio project directory.');
      process.exit(1);
    }
    
    if (!options.model) {
      logger.error('Model name is required. Use --model <name> to specify a model name.');
      crudValidationCommand.help();
      return;
    }
    
    const modelName = options.model;
    const fields = options.fields ? parseFields(options.fields) : [];
    const library = options.library || 'zod';
    
    if (fields.length === 0) {
      logger.warning('No fields specified. Use --fields <fields> to specify fields for the model.');
    }
    
    // Determine output directory
    const outputDir = options.output || path.join(process.cwd(), 'src', 'validations');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      logger.info(`Created output directory: ${outputDir}`);
    }
    
    // Generate validation schema based on the selected library
    let schema = '';
    let fileName = '';
    
    switch (library.toLowerCase()) {
      case 'yup':
        schema = generateYupSchema(modelName, fields);
        fileName = `${modelName.toLowerCase()}.yup.validation.ts`;
        break;
      case 'zod':
        schema = generateZodSchema(modelName, fields);
        fileName = `${modelName.toLowerCase()}.zod.validation.ts`;
        break;
      case 'class-validator':
        schema = generateClassValidators(modelName, fields);
        fileName = `${modelName.toLowerCase()}.dto.ts`;
        break;
      default:
        schema = generateZodSchema(modelName, fields);
        fileName = `${modelName.toLowerCase()}.zod.validation.ts`;
    }
    
    const schemaPath = path.join(outputDir, fileName);
    
    fs.writeFileSync(schemaPath, schema);
    logger.success(`Generated ${library} validation schema: ${chalk.green(schemaPath)}`);
    
    logger.info('\nYou can now use this validation schema in your application.');
    logger.info(`Import it with: import { ${modelName}ValidationSchema } from './validations/${fileName.replace('.ts', '')}';`);
  });
