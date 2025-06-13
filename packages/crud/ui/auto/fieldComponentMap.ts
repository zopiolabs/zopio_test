/**
 * Field Component Map
 * Maps entity field types to UI components for form and table rendering
 */
import React, { useState, useMemo, forwardRef, useCallback } from 'react';
import type { ComponentType, ChangeEvent, ForwardedRef } from 'react';

// Import UI components from design-system package
import { Input } from "@repo/design-system/components/ui/input";
import { Switch } from "@repo/design-system/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/design-system/components/ui/select";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@repo/design-system/components/ui/radio-group";
import { Label } from "@repo/design-system/components/ui/label";
import { Slider } from "@repo/design-system/components/ui/slider";
import { Button } from "@repo/design-system/components/ui/button";
import { Calendar } from "@repo/design-system/components/ui/calendar";

// Import field component props type
import { FieldComponentProps, FieldOption } from './types';

// Translation hook - replace with actual implementation if available
interface TranslationHook {
  t: (key: string) => string;
}

const useCrudTranslation = (): TranslationHook => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'fields.generic.dropFiles': 'Drop files here',
        'fields.generic.orClickToUpload': 'or click to upload',
        'fields.generic.remove': 'Remove',
        'fields.generic.search': 'Search'
      };
      return translations[key] || key;
    }
  };
};

/**
 * Password input with show/hide functionality
 */
const PasswordInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          ref={ref}
          className={`${className || ''} pr-10`}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? "Hide" : "Show"}
        </Button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

/**
 * Email input with validation
 */
const EmailInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, placeholder, error, ...props }, ref) => {
    const [isValid, setIsValid] = useState(true);
    
    const validateEmail = (email: string): boolean => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    };
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setIsValid(newValue === "" || validateEmail(newValue));
      if (onChange) {
        onChange(newValue);
      }
    };
    
    return (
      <div className="space-y-2">
        <Input
          type="email"
          ref={ref}
          className={className}
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder || "Email address"}
          {...props}
        />
        {!isValid && <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
EmailInput.displayName = "EmailInput";

/**
 * URL input with validation
 */
const UrlInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, placeholder, error, ...props }, ref) => {
    const [isValid, setIsValid] = useState(true);
    
    const validateUrl = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    };
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setIsValid(newValue === "" || validateUrl(newValue));
      if (onChange) {
        onChange(newValue);
      }
    };
    
    return (
      <div className="space-y-2">
        <Input
          type="url"
          ref={ref}
          className={className}
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder || "https://example.com"}
          {...props}
        />
        {!isValid && <p className="text-red-500 text-xs mt-1">Please enter a valid URL</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
UrlInput.displayName = "UrlInput";

/**
 * Number input with slider
 */
const NumberWithSlider = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, min = 0, max = 100, step = 1, ...props }, ref) => {
    const [numberValue, setNumberValue] = useState<number>(Number(value) || 0);
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setNumberValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };
    
    const handleSliderChange = (newValue: number[]) => {
      setNumberValue(newValue[0]);
      if (onChange) {
        onChange(newValue[0]);
      }
    };
    
    return (
      <div className="space-y-4">
        <Input 
          type="number" 
          ref={ref}
          className={className}
          value={numberValue}
          onChange={handleInputChange}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          {...props}
        />
        <Slider
          value={[numberValue]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          disabled={disabled}
        />
      </div>
    );
  }
);
NumberWithSlider.displayName = "NumberWithSlider";

/**
 * Phone input with formatting
 */
const PhoneInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, placeholder, ...props }, ref) => {
    const formatPhoneNumber = (value: string): string => {
      // Remove all non-numeric characters
      const cleaned = value.replace(/\D/g, '');
      
      // Format as (XXX) XXX-XXXX
      if (cleaned.length >= 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      } else if (cleaned.length >= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length >= 3) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      }
      return cleaned;
    };
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatPhoneNumber(e.target.value);
      if (onChange) {
        onChange(formattedValue);
      }
    };
    
    return (
      <Input 
        type="tel" 
        ref={ref}
        className={className}
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder || "(123) 456-7890"}
        {...props}
      />
    );
  }
);
PhoneInput.displayName = "PhoneInput";

/**
 * Radio group component
 */
const RadioGroupComponent = forwardRef<HTMLDivElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, options = [], ...props }, ref) => {
    const handleValueChange = (newValue: string) => {
      if (onChange) {
        onChange(newValue);
      }
    };
    
    return (
      <RadioGroup
        value={String(value || "")}
        onValueChange={handleValueChange}
        disabled={disabled}
        className={className}
        {...props}
      >
        <div className="space-y-2" ref={ref}>
          {options.map((option) => (
            <div key={String(option.value)} className="flex items-center space-x-2">
              <RadioGroupItem 
                id={`${props.id || 'radio'}-${option.value}`} 
                value={String(option.value)} 
                disabled={option.disabled || disabled}
              />
              <Label htmlFor={`${props.id || 'radio'}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    );
  }
);
RadioGroupComponent.displayName = "RadioGroupComponent";

/**
 * Checkbox group component
 */
const CheckboxGroup = forwardRef<HTMLDivElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, options = [], ...props }, ref) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(
      Array.isArray(value) ? value.map(String) : []
    );
    
    const handleChange = (option: FieldOption) => {
      const optionValue = String(option.value);
      let newValues: string[];
      
      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter(val => val !== optionValue);
      } else {
        newValues = [...selectedValues, optionValue];
      }
      
      setSelectedValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    };

    return (
      <div className="space-y-2" ref={ref}>
        {options.map((option) => (
          <div key={String(option.value)} className="flex items-center space-x-2">
            <Checkbox
              id={`${props.id || 'checkbox'}-${option.value}`}
              checked={selectedValues.includes(String(option.value))}
              onCheckedChange={() => handleChange(option)}
              disabled={option.disabled || disabled}
            />
            <Label htmlFor={`${props.id || 'checkbox'}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </div>
    );
  }
);
CheckboxGroup.displayName = "CheckboxGroup";

/**
 * File upload component
 */
const FileUpload = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, multiple, accept, ...props }, ref) => {
    const { t } = useCrudTranslation();
    const [files, setFiles] = useState<File[]>(value instanceof FileList ? Array.from(value) : []);
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setFiles(newFiles);
        if (onChange) {
          onChange(multiple ? newFiles : newFiles[0]);
        }
      }
    };
    
    const removeFile = (index: number) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
      if (onChange) {
        onChange(multiple ? newFiles : newFiles[0] || null);
      }
    };
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center w-full">
          <label htmlFor={props.id || 'file-upload'} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">{t('fields.generic.dropFiles')}</p>
              <p className="text-xs text-gray-500">{t('fields.generic.orClickToUpload')}</p>
            </div>
            <input 
              id={props.id || 'file-upload'} 
              type="file" 
              className="hidden" 
              onChange={handleFileChange} 
              disabled={disabled}
              multiple={multiple}
              accept={accept}
              ref={ref}
              {...props}
            />
          </label>
        </div>
        
        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span className="text-sm truncate max-w-xs">{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                  >
                    {t('fields.generic.remove')}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";

/**
 * Rich text editor component (simplified version)
 */
const RichTextEditor = forwardRef<HTMLTextAreaElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, rows = 5, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };
    
    return (
      <div className="space-y-2">
        <div className="flex space-x-1 mb-2 bg-gray-100 p-1 rounded">
          <Button type="button" variant="ghost" size="sm" disabled={disabled}>Bold</Button>
          <Button type="button" variant="ghost" size="sm" disabled={disabled}>Italic</Button>
          <Button type="button" variant="ghost" size="sm" disabled={disabled}>Underline</Button>
          <Button type="button" variant="ghost" size="sm" disabled={disabled}>Link</Button>
        </div>
        <Textarea
          ref={ref}
          className={className}
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          rows={rows}
          {...props}
        />
      </div>
    );
  }
);
RichTextEditor.displayName = "RichTextEditor";

/**
 * Multi-select component
 */
const MultiSelect = forwardRef<HTMLDivElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, options = [], ...props }, ref) => {
    const { t } = useCrudTranslation();
    const [selectedValues, setSelectedValues] = useState<string[]>(
      Array.isArray(value) ? value.map(String) : []
    );
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredOptions = options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleChange = (option: FieldOption) => {
      const optionValue = String(option.value);
      let newValues: string[];
      
      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter(val => val !== optionValue);
      } else {
        newValues = [...selectedValues, optionValue];
      }
      
      setSelectedValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    };
    
    const removeValue = (value: string) => {
      const newValues = selectedValues.filter(val => val !== value);
      setSelectedValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    };
    
    return (
      <div className="space-y-2" ref={ref}>
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedValues.map(value => {
            const option = options.find(o => String(o.value) === value);
            return (
              <span key={value} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center" role="button">
                {option?.label}
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => removeValue(value)}
                  disabled={disabled}
                >
                  ×
                </Button>
              </span>
            );
          })}
        </div>
        
        <Input
          type="text"
          placeholder={t('fields.generic.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
          className="mb-2"
        />
        
        <div className="border rounded max-h-60 overflow-y-auto">
          {filteredOptions.map(option => (
            <div key={String(option.value)} className="flex items-center p-2 hover:bg-gray-100">
              <Checkbox 
                id={`${props.id || 'multiselect'}-${option.value}`}
                checked={selectedValues.includes(String(option.value))}
                onCheckedChange={() => handleChange(option)}
                disabled={option.disabled || disabled}
              />
              <Label htmlFor={`${props.id || 'multiselect'}-${option.value}`} className="ml-2">{option.label}</Label>
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <div className="p-2 text-center text-gray-500">No options found</div>
          )}
        </div>
      </div>
    );
  }
);
MultiSelect.displayName = "MultiSelect";

/**
 * JSON editor component
 */
const JsonEditor = forwardRef<HTMLTextAreaElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, error, ...props }, ref) => {
    const [jsonError, setJsonError] = useState<string | null>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      try {
        if (newValue.trim()) {
          JSON.parse(newValue);
          setJsonError(null);
        } else {
          setJsonError(null);
        }
      } catch (e) {
        setJsonError("Invalid JSON format");
      }
      
      if (onChange) {
        onChange(newValue);
      }
    };
    
    const jsonString = useMemo(() => {
      try {
        return JSON.stringify(value || {}, null, 2);
      } catch (e) {
        return '';
      }
    }, [value]);
    
    return (
      <div className="space-y-2">
        <Textarea
          ref={ref}
          className={`font-mono ${className || ''}`}
          value={jsonString}
          onChange={handleChange}
          disabled={disabled}
          rows={10}
          {...props}
        />
        {jsonError && <p className="text-red-500 text-xs mt-1">{jsonError}</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
JsonEditor.displayName = "JsonEditor";

/**
 * Color picker component
 */
const ColorPicker = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };
    
    return (
      <div className="flex items-center space-x-2">
        <Input
          type="color"
          ref={ref}
          className={`w-12 h-12 p-1 ${className || ''}`}
          value={value || "#000000"}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <Input
          type="text"
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

/**
 * Date picker component
 */
const DatePicker = forwardRef<HTMLDivElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, ...props }, ref) => {
    const [date, setDate] = useState<Date | undefined>(
      value instanceof Date ? value : value ? new Date(value) : undefined
    );
    
    const handleSelect = (newDate: Date | undefined) => {
      setDate(newDate);
      if (onChange) {
        onChange(newDate);
      }
    };
    
    return (
      <div ref={ref} className={className}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={disabled}
          {...props}
        />
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

/**
 * Map of field types to components
 */
export const fieldComponentMap: Record<string, React.ComponentType<FieldComponentProps>> = {
  string: Input,
  number: NumberWithSlider,
  boolean: Switch,
  date: DatePicker,
  enum: RadioGroupComponent,
  relation: Select,
  text: Textarea,
  file: FileUpload,
  richtext: RichTextEditor,
  multiselect: MultiSelect,
  json: JsonEditor,
  color: ColorPicker,
  password: PasswordInput,
  email: EmailInput,
  url: UrlInput,
  phone: PhoneInput,
  checkbox: CheckboxGroup,
};

/**
 * Password input with show/hide functionality
 */
const PasswordInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          ref={ref}
          className={`${className || ''} pr-10`}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? "Hide" : "Show"}
        </Button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

/**
 * Email input with validation
 */
const EmailInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, placeholder, error, ...props }, ref) => {
    const [isValid, setIsValid] = useState(true);
    
    const validateEmail = (email: string): boolean => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    };
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setIsValid(newValue === "" || validateEmail(newValue));
      if (onChange) {
        onChange(newValue);
      }
    };
    
    return (
      <div className="space-y-2">
        <Input
          type="email"
          ref={ref}
          className={className}
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder || "Email address"}
          {...props}
        />
        {!isValid && <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
EmailInput.displayName = "EmailInput";

/**
 * URL input with validation
 */
const UrlInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, placeholder, error, ...props }, ref) => {
    const [isValid, setIsValid] = useState(true);
    
    const validateUrl = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    };
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setIsValid(newValue === "" || validateUrl(newValue));
      if (onChange) {
        onChange(newValue);
      }
    };
    
    return (
      <div className="space-y-2">
        <Input
          type="url"
          ref={ref}
          className={className}
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder || "https://example.com"}
          {...props}
        />
        {!isValid && <p className="text-red-500 text-xs mt-1">Please enter a valid URL</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
UrlInput.displayName = "UrlInput";

/**
 * Number input with slider
 */
const NumberWithSlider = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, min = 0, max = 100, step = 1, ...props }, ref) => {
    const [numberValue, setNumberValue] = useState<number>(Number(value) || 0);
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setNumberValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };
    
    const handleSliderChange = (newValue: number[]) => {
      setNumberValue(newValue[0]);
      if (onChange) {
        onChange(newValue[0]);
      }
    };
    
    return (
      <div className="space-y-4">
        <Input 
          type="number" 
          ref={ref}
          className={className}
          value={numberValue}
          onChange={handleInputChange}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          {...props}
        />
        <Slider
          value={[numberValue]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          disabled={disabled}
        />
      </div>
    );
  }
);
NumberWithSlider.displayName = "NumberWithSlider";

/**
 * Phone input with formatting
 */
const PhoneInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, placeholder, ...props }, ref) => {
    const formatPhoneNumber = (value: string): string => {
      // Remove all non-numeric characters
      const cleaned = value.replace(/\D/g, '');
      
      // Format as (XXX) XXX-XXXX
      if (cleaned.length >= 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      } else if (cleaned.length >= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length >= 3) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      }
      return cleaned;
    };
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatPhoneNumber(e.target.value);
      if (onChange) {
        onChange(formattedValue);
      }
    };
    
    return (
      <Input 
        type="tel" 
        ref={ref}
        className={className}
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder || "(123) 456-7890"}
        {...props}
      />
    );
  }
);
PhoneInput.displayName = "PhoneInput";

/**
 * Radio group component
 */
const RadioGroupComponent = forwardRef<HTMLDivElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, options = [], ...props }, ref) => {
    const handleValueChange = (newValue: string) => {
      if (onChange) {
        onChange(newValue);
      }
    };
    
    return (
      <RadioGroup
        value={String(value)}
        onValueChange={handleValueChange}
        disabled={disabled}
        className={className}
        {...props}
      >
        <div className="space-y-2" ref={ref}>
          {options.map((option) => (
            <div key={String(option.value)} className="flex items-center space-x-2">
              <RadioGroupItem 
                id={`${props.id || 'radio'}-${option.value}`} 
                value={String(option.value)} 
                disabled={option.disabled || disabled}
              />
              <Label htmlFor={`${props.id || 'radio'}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    );
  }
);
RadioGroupComponent.displayName = "RadioGroupComponent";

/**
 * Checkbox group component
 */
const CheckboxGroup = forwardRef<HTMLDivElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, options = [], ...props }, ref) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(
      Array.isArray(value) ? value.map(String) : []
    );
    
    const handleChange = (option: FieldOption) => {
      const optionValue = String(option.value);
      let newValues: string[];
      
      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter(val => val !== optionValue);
      } else {
        newValues = [...selectedValues, optionValue];
      }
      
      setSelectedValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    };

    return (
      <div className="space-y-2" ref={ref}>
        {options.map((option) => (
          <div key={String(option.value)} className="flex items-center space-x-2">
            <Checkbox
              id={`${props.id || 'checkbox'}-${option.value}`}
              checked={selectedValues.includes(String(option.value))}
              onCheckedChange={() => handleChange(option)}
              disabled={option.disabled || disabled}
            />
            <Label htmlFor={`${props.id || 'checkbox'}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </div>
    );
  }
);
CheckboxGroup.displayName = "CheckboxGroup";

/**
 * File upload component
 */
const FileUpload = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, multiple, accept, ...props }, ref) => {
    const { t } = useCrudTranslation();
    const [files, setFiles] = useState<File[]>(value instanceof FileList ? Array.from(value) : []);
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setFiles(newFiles);
        if (onChange) {
          onChange(multiple ? newFiles : newFiles[0]);
        }
      }
    };
    
    const removeFile = (index: number) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
      if (onChange) {
        onChange(multiple ? newFiles : newFiles[0] || null);
      }
    };
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center w-full">
          <label htmlFor={props.id || 'file-upload'} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">{t('fields.generic.dropFiles')}</p>
              <p className="text-xs text-gray-500">{t('fields.generic.orClickToUpload')}</p>
            </div>
            <input 
              id={props.id || 'file-upload'} 
              type="file" 
              className="hidden" 
              onChange={handleFileChange} 
              disabled={disabled}
              multiple={multiple}
              accept={accept}
              ref={ref}
              {...props}
            />
          </label>
        </div>
        
        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span className="text-sm truncate max-w-xs">{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                  >
                    {t('fields.generic.remove')}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";

/**
 * Rich text editor component (simplified version)
 */
const RichTextEditor = forwardRef<HTMLTextAreaElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, rows = 5, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };
    
    return (
      <div className="space-y-2">
        <div className="flex space-x-1 mb-2 bg-gray-100 p-1 rounded">
          <Button type="button" variant="ghost" size="sm" disabled={disabled}>Bold</Button>
          <Button type="button" variant="ghost" size="sm" disabled={disabled}>Italic</Button>
          <Button type="button" variant="ghost" size="sm" disabled={disabled}>Underline</Button>
          <Button type="button" variant="ghost" size="sm" disabled={disabled}>Link</Button>
        </div>
        <Textarea
          ref={ref}
          className={className}
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          rows={rows}
          {...props}
        />
      </div>
    );
  }
);
RichTextEditor.displayName = "RichTextEditor";

/**
 * Multi-select component
 */
const MultiSelect = forwardRef<HTMLDivElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, options = [], ...props }, ref) => {
    const { t } = useCrudTranslation();
    const [selectedValues, setSelectedValues] = useState<string[]>(
      Array.isArray(value) ? value.map(String) : []
    );
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredOptions = options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleChange = (option: FieldOption) => {
      const optionValue = String(option.value);
      let newValues: string[];
      
      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter(val => val !== optionValue);
      } else {
        newValues = [...selectedValues, optionValue];
      }
      
      setSelectedValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    };
    
    const removeValue = (value: string) => {
      const newValues = selectedValues.filter(val => val !== value);
      setSelectedValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    };
    
    return (
      <div className="space-y-2" ref={ref}>
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedValues.map(value => {
            const option = options.find(o => String(o.value) === value);
            return (
              <span key={value} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center" role="button">
                {option?.label}
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => removeValue(value)}
                  disabled={disabled}
                >
                  ×
                </Button>
              </span>
            );
          })}
        </div>
        
        <Input
          type="text"
          placeholder={t('fields.generic.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
          className="mb-2"
        />
        
        <div className="border rounded max-h-60 overflow-y-auto">
          {filteredOptions.map(option => (
            <div key={String(option.value)} className="flex items-center p-2 hover:bg-gray-100">
              <Checkbox 
                id={`${props.id || 'multiselect'}-${option.value}`}
                checked={selectedValues.includes(String(option.value))}
                onCheckedChange={() => handleChange(option)}
                disabled={option.disabled || disabled}
              />
              <Label htmlFor={`${props.id || 'multiselect'}-${option.value}`} className="ml-2">{option.label}</Label>
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <div className="p-2 text-center text-gray-500">No options found</div>
          )}
        </div>
      </div>
    );
  }
);
MultiSelect.displayName = "MultiSelect";

/**
 * JSON editor component
 */
const JsonEditor = forwardRef<HTMLTextAreaElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, error, ...props }, ref) => {
    const [jsonError, setJsonError] = useState<string | null>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      try {
        if (newValue.trim()) {
          JSON.parse(newValue);
          setJsonError(null);
        } else {
          setJsonError(null);
        }
      } catch (e) {
        setJsonError("Invalid JSON format");
      }
      
      if (onChange) {
        onChange(newValue);
      }
    };
    
    const jsonString = useMemo(() => {
      try {
        return JSON.stringify(value || {}, null, 2);
      } catch (e) {
        return '';
      }
    }, [value]);
    
    return (
      <div className="space-y-2">
        <Textarea
          ref={ref}
          className={`font-mono ${className || ''}`}
          value={jsonString}
          onChange={handleChange}
          disabled={disabled}
          rows={10}
          {...props}
        />
        {jsonError && <p className="text-red-500 text-xs mt-1">{jsonError}</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
JsonEditor.displayName = "JsonEditor";

/**
 * Color picker component
 */
const ColorPicker = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };
    
    return (
      <div className="flex items-center space-x-2">
        <Input
          type="color"
          ref={ref}
          className={`w-12 h-12 p-1 ${className || ''}`}
          value={value || "#000000"}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <Input
          type="text"
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

/**
 * Map of field types to components
 */
export const fieldComponentMap: Record<string, React.ComponentType<FieldComponentProps>> = {
  string: Input,
  number: NumberWithSlider,
  boolean: Switch,
  date: Calendar,
  enum: RadioGroupComponent,
  relation: Select,
  text: Textarea,
  file: FileUpload,
  richtext: RichTextEditor,
  multiselect: MultiSelect,
  json: JsonEditor,
  color: ColorPicker,
  password: PasswordInput,
  email: EmailInput,
  url: UrlInput,
  phone: PhoneInput,
  checkbox: CheckboxGroup,
};


// Import translation hook - replace with actual implementation if available
interface TranslationHook {
  t: (key: string) => string;
}

const useCrudTranslation = (): TranslationHook => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'fields.generic.dropFiles': 'Drop files here',
        'fields.generic.orClickToUpload': 'or click to upload',
        'fields.generic.remove': 'Remove',
        'fields.generic.search': 'Search'
      };
      return translations[key] || key;
    }
  };
};


/**
 * Password input with show/hide functionality
 */
const PasswordInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          ref={ref}
          {...props}
          className={`${props.className || ''} pr-10`}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => setShowPassword(!showPassword)}
          disabled={props.disabled}
        >
          {showPassword ? "Hide" : "Show"}
        </Button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

/**
 * Email input with validation
 */
const EmailInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  (props, ref) => {
    const [error, setError] = useState<string | null>(null);
    
    const validateEmail = (email: string): boolean => {
      if (!email) return true;
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(email);
    };
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!validateEmail(value) && value) {
        setError("Please enter a valid email address");
      } else {
        setError(null);
      }
      props.onChange(value);
    };
    
    return (
      <div className="space-y-2">
        <Input
          type="email"
          ref={ref}
          {...props}
          onChange={handleChange}
          className={props.className}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
EmailInput.displayName = "EmailInput";

/**
 * URL input with validation
 */
const UrlInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  (props, ref) => {
    const [error, setError] = useState<string | null>(null);
    
    const validateUrl = (url: string): boolean => {
      if (!url) return true;
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    };
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!validateUrl(value) && value) {
        setError("Please enter a valid URL");
      } else {
        setError(null);
      }
      props.onChange(value);
    };
    
    return (
      <div className="space-y-2">
        <Input
          type="url"
          ref={ref}
          {...props}
          onChange={handleChange}
          className={props.className}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
UrlInput.displayName = "UrlInput";

/**
 * Number input with slider
 */
const NumberWithSlider = forwardRef<HTMLInputElement, FieldComponentProps>(
  (props, ref) => {
    const min = props.min || 0;
    const max = props.max || 100;
    const step = props.step || 1;
    
    const handleSliderChange = (value: number[]) => {
      props.onChange(value[0]);
    };
    
    return (
      <div className="space-y-4">
        <Input 
          type="number" 
          ref={ref}
          {...props} 
          min={min}
          max={max}
          step={step}
        />
        <Slider 
          defaultValue={[props.value || min]} 
          min={min} 
          max={max} 
          step={step} 
          onValueChange={handleSliderChange}
          disabled={props.disabled}
        />
      </div>
    );
  }
);
NumberWithSlider.displayName = "NumberWithSlider";

/**
 * Number input with slider
 */
const NumberWithSlider = React.forwardRef<HTMLInputElement, FieldComponentProps>(
  (props, ref) => {
    const min = props.min || 0;
    const max = props.max || 100;
    const step = props.step || 1;
    
    const handleSliderChange = (value: number[]) => {
      props.onChange(value[0]);
    };
    
    return (
      <div className="space-y-4">
        <Input 
          type="number" 
          ref={ref}
          {...props} 
          min={min}
          max={max}
          step={step}
        />
        <Slider 
          defaultValue={[props.value || min]} 
          min={min} 
          max={max} 
          step={step} 
          onValueChange={handleSliderChange}
          disabled={props.disabled}
        />
      </div>
    );
  }
);
NumberWithSlider.displayName = "NumberWithSlider";

/**
 * Phone input with formatting
 */
const PhoneInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  (props, ref) => {
    const formatPhoneNumber = (value: string): string => {
      // Remove all non-digit characters
      const digits = value.replace(/\D/g, '');
      
      // Format as (XXX) XXX-XXXX for US numbers
      if (digits.length <= 3) {
        return digits;
      } else if (digits.length <= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
    };
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatPhoneNumber(e.target.value);
      props.onChange(formattedValue);
    };
    
    return (
      <Input 
        type="tel" 
        ref={ref}
        {...props} 
        onChange={handleChange}
        placeholder={props.placeholder || "(123) 456-7890"}
      />
    );
  }
);
PhoneInput.displayName = "PhoneInput";
        setError(null);
      }
      props.onChange(value);
    };
    
    return (
      <div className="space-y-2">
        <Input 
          type="email" 
          ref={ref}
          {...props} 
          onChange={handleChange}
          className={`${props.className || ''} ${error ? "border-red-500" : ""}`}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
EmailInput.displayName = "EmailInput";

/**
 * URL input with validation
 */
const UrlInput = React.forwardRef<HTMLInputElement, FieldComponentProps>(
  (props, ref) => {
    const [error, setError] = React.useState<string | null>(null);
    
    const validateUrl = (url: string): boolean => {
      if (!url) return true;
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!validateUrl(value) && value) {
        setError("Please enter a valid URL");
      } else {
        setError(null);
      }
      props.onChange(value);
    };
    
    return (
      <div className="space-y-2">
        <Input 
          type="url" 
          ref={ref}
          {...props} 
          onChange={handleChange}
          className={`${props.className || ''} ${error ? "border-red-500" : ""}`}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
UrlInput.displayName = "UrlInput";

/**
 * Color picker with hex input
 */
const ColorPicker = React.forwardRef<HTMLInputElement, FieldComponentProps>(
  (props, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <Input 
          type="color" 
          ref={ref}
          {...props} 
          className="w-12 h-8 p-1" 
        />
        <Input 
          type="text" 
          value={props.value || '#000000'} 
          onChange={(e) => props.onChange(e.target.value)} 
          className="flex-1" 
          placeholder="#000000" 
          disabled={props.disabled}
        />
      </div>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

/**
 * Phone input with formatting
 */
const PhoneInput = React.forwardRef<HTMLInputElement, FieldComponentProps>(
  (props, ref) => {
    const formatPhoneNumber = (value: string): string => {
      if (!value) return '';
      
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatPhoneNumber(e.target.value);
      props.onChange(formattedValue);
    };
    
    return (
      <Input 
        type="tel" 
        ref={ref}
        {...props} 
        onChange={handleChange}
        placeholder={props.placeholder || '(XXX) XXX-XXXX'}
      />
    );
  }
);
PhoneInput.displayName = "PhoneInput";

/**
 * Radio group component with options
 */
const RadioGroupComponent = React.forwardRef<HTMLDivElement, FieldComponentProps>(
  (props, ref) => {
    const options = props.options || [];
    
    return (
      <RadioGroup
        ref={ref}
        defaultValue={props.value}
        onValueChange={props.onChange}
        disabled={props.disabled}
        className={props.className}
      >
        {options.map((option) => (
          <div key={String(option.value)} className="flex items-center space-x-2">
            <RadioGroup.Item value={String(option.value)} id={`${props.id}-${option.value}`} />
            <Label htmlFor={`${props.id}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    );
  }
);
RadioGroupComponent.displayName = "RadioGroupComponent";

/**
 * Checkbox group for multiple selections
 */
const CheckboxGroup = React.forwardRef<HTMLDivElement, FieldComponentProps>(
  (props, ref) => {
    const options = props.options || [];
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
      Array.isArray(props.value) ? props.value.map(String) : []
    );

    const handleChange = (option: FieldOption) => {
      const value = String(option.value);
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      
      setSelectedValues(newSelectedValues);
      props.onChange(newSelectedValues);
    };

    return (
      <div className="space-y-2" ref={ref}>
        {options.map((option) => (
          <div key={String(option.value)} className="flex items-center space-x-2">
            <Checkbox
              id={`${props.id}-${option.value}`}
              checked={selectedValues.includes(String(option.value))}
              onCheckedChange={() => handleChange(option)}
              disabled={props.disabled}
            />
            <Label htmlFor={`${props.id}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </div>
    );
  }
);
CheckboxGroup.displayName = "CheckboxGroup";

/**
 * Map field types to components
 */
export const fieldComponentMap: Record<string, ComponentType<FieldComponentProps>> = {
  // Basic types
  string: Input,
  number: NumberWithSlider,
  boolean: Switch,
  date: DatePicker,
  enum: Select,
  relation: Select,
  text: Textarea,
  
  // Advanced types
  password: PasswordInput,
  email: EmailInput,
  url: UrlInput,
  color: ColorPicker,
  tel: PhoneInput,
  radio: RadioGroupComponent,
  checkbox: CheckboxGroup,
  multiselect: CheckboxGroup,
};
      const fileList = Array.from(e.target.files);
      setFiles(fileList);
      props.onChange(fileList);
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    props.onChange(newFiles);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center w-full">
        <label htmlFor={props.id} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">{t('fields.generic.dropFiles')}</span> {t('fields.generic.orClickToUpload')}
            </p>
            <p className="text-xs text-gray-500">{props.accept || 'Any file type'}</p>
          </div>
          <input 
            id={props.id} 
            type="file" 
            className="hidden" 
            onChange={handleFileChange} 
            multiple={props.multiple} 
            accept={props.accept} 
            disabled={props.disabled}
          />
        </label>
      </div>
      
      {files.length > 0 && (
        <ul className="mt-2 divide-y divide-gray-200 border rounded-md">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between py-2 px-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm truncate max-w-xs">{file.name}</span>
                <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button 
                type="button" 
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 text-sm"
                disabled={props.disabled}
              >
                {t('fields.generic.remove')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Rich Text Editor Component (simplified version)
const RichTextEditor = (props: any) => {
  return (
    <div className="border rounded-md p-2">
      <div className="flex space-x-2 mb-2 border-b pb-2">
        <button type="button" className="p-1 hover:bg-gray-100 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
        <button type="button" className="p-1 hover:bg-gray-100 rounded font-bold">B</button>
        <button type="button" className="p-1 hover:bg-gray-100 rounded italic">I</button>
        <button type="button" className="p-1 hover:bg-gray-100 rounded underline">U</button>
      </div>
      <Textarea 
        {...props} 
        className="min-h-[150px] border-none focus:ring-0 p-0" 
      />
    </div>
  );
};

// Multi-select Component
const MultiSelect = (props: any) => {
  const { t } = useCrudTranslation();
  const options: FieldOption[] = props.options || [];
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    Array.isArray(props.value) ? props.value : []
  );
  
  const handleChange = (option: FieldOption) => {
    const newValues = selectedValues.includes(String(option.value))
      ? selectedValues.filter(v => v !== String(option.value))
      : [...selectedValues, String(option.value)];
    
    setSelectedValues(newValues);
    props.onChange(newValues);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedValues.map(value => {
          const option = options.find(o => String(o.value) === value);
          return (
            <div key={value} className="bg-primary text-white px-2 py-1 rounded-full text-sm flex items-center">
              <span>{option?.label || value}</span>
              <button 
                type="button" 
                className="ml-1 text-white hover:text-gray-200"
                onClick={() => handleChange({ value, label: option?.label || value })}
                disabled={props.disabled}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="border rounded-md p-2">
        <div className="mb-2">
          <Input 
            type="text" 
            placeholder={t('fields.generic.search')} 
            className="w-full" 
            disabled={props.disabled}
          />
        </div>
        
        <div className="max-h-[150px] overflow-y-auto">
          {options.map(option => (
            <div key={String(option.value)} className="flex items-center space-x-2 py-1">
              <Checkbox 
                id={`${props.id}-${option.value}`}
                checked={selectedValues.includes(String(option.value))}
                onCheckedChange={() => handleChange(option)}
                disabled={props.disabled}
              />
              <Label htmlFor={`${props.id}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// JSON Editor Component
const JsonEditor = (props: any) => {
  const [error, setError] = React.useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const json = e.target.value.trim() ? JSON.parse(e.target.value) : {};
      setError(null);
      props.onChange(json);
    } catch (err) {
      setError('Invalid JSON');
    }
  };
  
  const jsonString = React.useMemo(() => {
    try {
      return JSON.stringify(props.value || {}, null, 2);
    } catch (e) {
      return '{}';
    }
  }, [props.value]);
  
  return (
    <div>
      <Textarea 
        {...props}
        value={jsonString}
        onChange={handleChange}
        className="font-mono text-sm min-h-[150px]"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// Color Picker Component
const ColorPicker = (props: any) => {
  return (
    <div className="flex items-center space-x-2">
      <Input 
        type="color" 
        {...props} 
        className="w-12 h-8 p-1" 
      />
      <Input 
        type="text" 
        value={props.value} 
        onChange={props.onChange} 
        className="flex-1" 
        placeholder="#000000" 
        disabled={props.disabled}
      />
    </div>
  );
};

// Number Input with Slider
const NumberWithSlider = (props: any) => {
  const min = props.min || 0;
  const max = props.max || 100;
  const step = props.step || 1;
  
  const handleSliderChange = (value: number[]) => {
    props.onChange(value[0]);
  };
  
  return (
    <div className="space-y-4">
      <Input 
        type="number" 
        {...props} 
        min={min}
        max={max}
        step={step}
      />
      <Slider 
        defaultValue={[props.value || min]} 
        min={min} 
        max={max} 
        step={step} 
        onValueChange={handleSliderChange}
        disabled={props.disabled}
      />
    </div>
  );
};

// Password Input with Show/Hide
const PasswordInput = (props: any) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  return (
    <div className="relative">
      <Input 
        type={showPassword ? "text" : "password"} 
        {...props} 
      />
      <button 
        type="button" 
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
        onClick={() => setShowPassword(!showPassword)}
        disabled={props.disabled}
      >
        {showPassword ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  );
};

// Radio Group Component
const RadioGroupComponent = (props: any) => {
  const options: FieldOption[] = props.options || [];
  
  return (
    <RadioGroup 
      value={String(props.value)} 
      onValueChange={props.onChange}
      disabled={props.disabled}
    >
      <div className="space-y-2">
        {options.map(option => (
          <div key={String(option.value)} className="flex items-center space-x-2">
            <RadioGroupItem value={String(option.value)} id={`${props.id}-${option.value}`} />
            <Label htmlFor={`${props.id}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
};

// Email Input with Validation
const EmailInput = (props: any) => {
  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };
  
  const [isValid, setIsValid] = React.useState<boolean>(true);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsValid(value === '' || validateEmail(value));
    props.onChange(e);
  };
  
  return (
    <div>
      <Input 
        type="email" 
        {...props} 
        onChange={handleChange}
        className={!isValid ? 'border-red-500' : ''}
      />
      {!isValid && (
        <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
      )}
    </div>
  );
};

// URL Input with Validation
const UrlInput = (props: any) => {
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const [isValid, setIsValid] = React.useState<boolean>(true);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsValid(value === '' || validateUrl(value));
    props.onChange(e);
  };
  
  return (
    <div>
      <Input 
        type="url" 
        {...props} 
        onChange={handleChange}
        className={!isValid ? 'border-red-500' : ''}
      />
      {!isValid && (
        <p className="text-red-500 text-xs mt-1">Please enter a valid URL</p>
      )}
    </div>
  );
};

// Phone Input with Formatting
const PhoneInput = (props: any) => {
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    // Create a synthetic event with the formatted value
    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: formattedValue }
    };
    props.onChange(syntheticEvent);
  };
  
  return (
    <Input 
      type="tel" 
      {...props} 
      onChange={handleChange}
      placeholder={props.placeholder || '(123) 456-7890'}
    />
  );
};

/**
 * File Upload Component
 */
const FileUpload = React.forwardRef<HTMLInputElement, FieldComponentProps>(
  (props, ref) => {
    const { t } = useCrudTranslation();
    const [files, setFiles] = React.useState<File[]>([]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const fileList = Array.from(e.target.files);
        setFiles(fileList);
        props.onChange(fileList);
      }
    };
    
    const removeFile = (index: number) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
      props.onChange(newFiles);
    };
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center w-full">
          <label htmlFor={props.id} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{t('fields.generic.dropFiles')}</span> {t('fields.generic.orClickToUpload')}
              </p>
              <p className="text-xs text-gray-500">{props.accept || 'Any file type'}</p>
            </div>
            <input 
              id={props.id} 
              type="file" 
              className="hidden" 
              onChange={handleFileChange} 
              multiple={props.multiple} 
              accept={props.accept} 
              disabled={props.disabled}
              ref={ref}
            />
          </label>
        </div>
        
        {files.length > 0 && (
          <ul className="mt-2 divide-y divide-gray-200 border rounded-md">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between py-2 px-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm truncate max-w-xs">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  disabled={props.disabled}
                >
                  {t('fields.generic.remove')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";

/**
 * Rich Text Editor Component
 */
const RichTextEditor = React.forwardRef<HTMLTextAreaElement, FieldComponentProps>(
  (props, ref) => {
    return (
      <div className="border rounded-md p-2">
        <div className="flex space-x-2 mb-2 border-b pb-2">
          <button type="button" className="p-1 hover:bg-gray-100 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
          <button type="button" className="p-1 hover:bg-gray-100 rounded font-bold">B</button>
          <button type="button" className="p-1 hover:bg-gray-100 rounded italic">I</button>
          <button type="button" className="p-1 hover:bg-gray-100 rounded underline">U</button>
        </div>
        <Textarea 
          {...props} 
          ref={ref}
          className="min-h-[150px] border-none focus:ring-0 p-0" 
        />
      </div>
    );
  }
);
RichTextEditor.displayName = "RichTextEditor";

/**
 * Multi-select Component
 */
const MultiSelect = React.forwardRef<HTMLDivElement, FieldComponentProps>(
  (props, ref) => {
    const { t } = useCrudTranslation();
    const options: FieldOption[] = props.options || [];
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
      Array.isArray(props.value) ? props.value.map(String) : []
    );
    
    const handleChange = (option: FieldOption) => {
      const optionValue = String(option.value);
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      
      setSelectedValues(newValues);
      props.onChange(newValues);
    };
    
    return (
      <div className="space-y-2" ref={ref}>
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedValues.map(value => {
            const option = options.find(o => String(o.value) === value);
            return (
              <div key={value} className="bg-primary text-white px-2 py-1 rounded-full text-sm flex items-center">
                <span>{option?.label || value}</span>
                <button 
                  type="button" 
                  className="ml-1 text-white hover:text-gray-200"
                  onClick={() => handleChange({ value, label: option?.label || value })}
                  disabled={props.disabled}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="border rounded-md p-2">
          <div className="mb-2">
            <Input 
              type="text" 
              placeholder={t('fields.generic.search')} 
              className="w-full" 
              disabled={props.disabled}
            />
          </div>
          
          <div className="max-h-[150px] overflow-y-auto">
            {options.map(option => (
              <div key={String(option.value)} className="flex items-center space-x-2 py-1">
                <Checkbox 
                  id={`${props.id}-${option.value}`}
                  checked={selectedValues.includes(String(option.value))}
                  onCheckedChange={() => handleChange(option)}
                  disabled={props.disabled}
                />
                <Label htmlFor={`${props.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
MultiSelect.displayName = "MultiSelect";

/**
 * JSON Editor Component
 */
const JsonEditor = React.forwardRef<HTMLTextAreaElement, FieldComponentProps>(
  (props, ref) => {
    const [error, setError] = React.useState<string | null>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      try {
        const json = e.target.value.trim() ? JSON.parse(e.target.value) : {};
        setError(null);
        props.onChange(json);
      } catch (err) {
        setError('Invalid JSON');
      }
    };
    
    const jsonString = React.useMemo(() => {
      try {
        return JSON.stringify(props.value || {}, null, 2);
      } catch (e) {
        return '{}';
      }
    }, [props.value]);
    
    return (
      <div>
        <Textarea 
          {...props}
          ref={ref}
          value={jsonString}
          onChange={handleChange}
          className="font-mono text-sm min-h-[150px]"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  string: Input,
  number: NumberWithSlider,
  boolean: Switch,
  date: Calendar,
  enum: RadioGroupComponent,
  relation: Select,
  text: Textarea,
  file: FileUpload,
  richtext: RichTextEditor,
  multiselect: MultiSelect,
  json: JsonEditor,
  color: ColorPicker,
  password: PasswordInput,
  email: EmailInput,
  url: UrlInput,
  phone: PhoneInput,
  radio: RadioGroupComponent,
  checkbox: CheckboxGroup,
};