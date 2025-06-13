import React, { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@repo/design-system/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@repo/design-system/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design-system/components/ui/popover";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Spinner } from "@repo/design-system/components/ui/spinner";
import { cn } from "@repo/design-system/lib/utils";
import { useCrudTranslation } from "../i18n";
import type { FieldComponentProps } from "./types";

export interface RelationOption {
  /**
   * Unique identifier for the relation
   */
  id: string | number;
  
  /**
   * Display label for the relation
   */
  label: string;
  
  /**
   * Optional description
   */
  description?: string;
  
  /**
   * Optional icon or avatar URL
   */
  icon?: string;
  
  /**
   * Whether this option is disabled
   */
  disabled?: boolean;
  
  /**
   * Additional data for the relation
   */
  data?: Record<string, unknown>;
}

export interface AutoRelationFieldProps extends FieldComponentProps {
  /**
   * Whether this is a multiple selection field
   */
  multiple?: boolean;
  
  /**
   * Function to fetch relation options (can be async)
   */
  fetchOptions?: (query: string) => Promise<RelationOption[]> | RelationOption[];
  
  /**
   * Static list of options (alternative to fetchOptions)
   */
  options?: RelationOption[];
  
  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;
  
  /**
   * Text to display when no options match the search
   */
  emptyMessage?: string;
  
  /**
   * Whether to show option descriptions
   */
  showDescriptions?: boolean;
  
  /**
   * Whether to show option icons/avatars
   */
  showIcons?: boolean;
  
  /**
   * Whether to allow creating new options
   */
  allowCreate?: boolean;
  
  /**
   * Function to create a new option
   */
  onCreate?: (value: string) => Promise<RelationOption> | RelationOption;
  
  /**
   * Whether to display selected options as badges (for multiple selection)
   */
  displayAsBadges?: boolean;
  
  /**
   * Maximum number of options that can be selected (for multiple selection)
   */
  maxItems?: number;
  
  /**
   * Debounce time in milliseconds for search input
   */
  debounceMs?: number;
  
  /**
   * Function to render custom option display
   */
  renderOption?: (option: RelationOption) => React.ReactNode;
  
  /**
   * Function to render custom selected value display
   */
  renderValue?: (option: RelationOption) => React.ReactNode;
  
  /**
   * Additional CSS class for the component
   */
  className?: string;
}

/**
 * AutoRelationField provides a searchable dropdown for selecting related entities.
 * Supports single and multiple selection, async data fetching, and custom rendering.
 */
export function AutoRelationField({
  id,
  name,
  value,
  onChange,
  onBlur,
  multiple = false,
  fetchOptions,
  options: staticOptions,
  placeholder = "Select...",
  emptyMessage = "No results found",
  showDescriptions = false,
  showIcons = false,
  allowCreate = false,
  onCreate,
  displayAsBadges = true,
  maxItems,
  debounceMs = 300,
  renderOption,
  renderValue,
  disabled = false,
  required = false,
  error,
  className,
  ...props
}: AutoRelationFieldProps) {
  const { t } = useCrudTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState<RelationOption[]>(staticOptions || []);
  const [selectedOptions, setSelectedOptions] = useState<RelationOption[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Initialize selected options based on value prop
  useEffect(() => {
    if (!value) {
      setSelectedOptions([]);
      return;
    }

    if (multiple) {
      // For multiple selection, value should be an array of IDs
      const valueArray = Array.isArray(value) ? value : [value];
      
      // Find matching options for the selected IDs
      const selected = options.filter(option => 
        valueArray.includes(option.id)
      );
      
      setSelectedOptions(selected);
    } else {
      // For single selection, value should be a single ID
      const selected = options.find(option => option.id === value);
      setSelectedOptions(selected ? [selected] : []);
    }
  }, [value, options, multiple]);

  // Load options when component mounts or when search query changes
  useEffect(() => {
    if (!fetchOptions) return;

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounce
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const fetchedOptions = await fetchOptions(searchQuery);
        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching relation options:", error);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    setSearchTimeout(timeout);

    // Cleanup
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchQuery, fetchOptions, debounceMs]);

  // Handle selection of an option
  const handleSelect = useCallback((option: RelationOption) => {
    if (disabled) return;

    let newSelectedOptions: RelationOption[];
    let newValue: string | number | (string | number)[] | undefined;

    if (multiple) {
      // Check if option is already selected
      const isSelected = selectedOptions.some(selected => selected.id === option.id);
      
      if (isSelected) {
        // Remove option if already selected
        newSelectedOptions = selectedOptions.filter(selected => selected.id !== option.id);
      } else {
        // Add option if not selected and under max limit
        if (maxItems && selectedOptions.length >= maxItems) {
          return; // Don't add if max limit reached
        }
        newSelectedOptions = [...selectedOptions, option];
      }
      
      // Update value as array of IDs
      newValue = newSelectedOptions.map(opt => opt.id);
    } else {
      // For single selection, replace current selection
      newSelectedOptions = [option];
      newValue = option.id;
      setOpen(false); // Close dropdown after selection for single select
    }

    setSelectedOptions(newSelectedOptions);
    
    if (onChange) {
      onChange(newValue);
    }
  }, [disabled, multiple, selectedOptions, maxItems, onChange]);

  // Handle removal of a selected option
  const handleRemove = useCallback((optionId: string | number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (disabled) return;

    const newSelectedOptions = selectedOptions.filter(option => option.id !== optionId);
    setSelectedOptions(newSelectedOptions);
    
    if (onChange) {
      if (multiple) {
        onChange(newSelectedOptions.map(opt => opt.id));
      } else {
        onChange(undefined);
      }
    }
  }, [disabled, selectedOptions, multiple, onChange]);

  // Handle creating a new option
  const handleCreate = useCallback(async () => {
    if (!allowCreate || !onCreate || !inputValue.trim() || disabled) return;

    try {
      setLoading(true);
      const newOption = await onCreate(inputValue.trim());
      
      // Add to options list
      setOptions(prev => [...prev, newOption]);
      
      // Select the new option
      handleSelect(newOption);
      
      // Clear input
      setInputValue("");
    } catch (error) {
      console.error("Error creating new option:", error);
    } finally {
      setLoading(false);
    }
  }, [allowCreate, onCreate, inputValue, disabled, handleSelect]);

  // Render a single option in the dropdown
  const renderOptionItem = (option: RelationOption) => {
    if (renderOption) {
      return renderOption(option);
    }

    const isSelected = selectedOptions.some(selected => selected.id === option.id);

    return (
      <CommandItem
        key={option.id}
        value={option.id.toString()}
        disabled={option.disabled}
        onSelect={() => handleSelect(option)}
        className={cn(
          "flex items-center gap-2 w-full",
          option.disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {showIcons && option.icon && (
          <img 
            src={option.icon} 
            alt="" 
            className="w-5 h-5 rounded-full object-cover"
          />
        )}
        
        <div className="flex flex-col flex-1 text-left">
          <span>{option.label}</span>
          {showDescriptions && option.description && (
            <span className="text-xs text-gray-500">{option.description}</span>
          )}
        </div>
        
        {isSelected && <Check className="w-4 h-4 opacity-70" />}
      </CommandItem>
    );
  };

  // Render the selected value(s)
  const renderSelectedValue = () => {
    if (selectedOptions.length === 0) {
      return (
        <span className="text-gray-500">
          {placeholder}
        </span>
      );
    }

    if (!multiple) {
      // Single selection
      const option = selectedOptions[0];
      
      if (renderValue) {
        return renderValue(option);
      }

      return (
        <div className="flex items-center gap-2">
          {showIcons && option.icon && (
            <img 
              src={option.icon} 
              alt="" 
              className="w-5 h-5 rounded-full object-cover"
            />
          )}
          <span>{option.label}</span>
        </div>
      );
    }

    // Multiple selection
    if (displayAsBadges) {
      return (
        <div className="flex flex-wrap gap-1 max-w-full">
          {selectedOptions.map(option => (
            <Badge 
              key={option.id} 
              variant="secondary"
              className="flex items-center gap-1 max-w-[200px] truncate"
            >
              {showIcons && option.icon && (
                <img 
                  src={option.icon} 
                  alt="" 
                  className="w-3 h-3 rounded-full object-cover"
                />
              )}
              <span className="truncate">{option.label}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={(e) => handleRemove(option.id, e)}
              />
            </Badge>
          ))}
        </div>
      );
    }

    // Display as comma-separated list
    return (
      <span className="truncate">
        {selectedOptions.map(option => option.label).join(", ")}
      </span>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-required={required}
            aria-invalid={!!error}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              error && "border-red-500",
              !selectedOptions.length && "text-gray-500"
            )}
            onClick={() => setOpen(!open)}
          >
            <div className="flex-1 flex items-center overflow-hidden">
              {renderSelectedValue()}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[200px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder={t("relation.search", { defaultValue: "Search..." })}
              value={inputValue}
              onValueChange={(value) => {
                setInputValue(value);
                setSearchQuery(value);
              }}
              className="h-9"
            />
            
            <CommandEmpty className="py-6 text-center text-sm">
              {loading ? (
                <div className="flex justify-center items-center py-2">
                  <Spinner size="sm" />
                </div>
              ) : (
                <>
                  {emptyMessage}
                  {allowCreate && inputValue.trim() && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={handleCreate}
                      disabled={loading}
                    >
                      {t("relation.create", { defaultValue: "Create" })} "{inputValue}"
                    </Button>
                  )}
                </>
              )}
            </CommandEmpty>
            
            <CommandGroup className="max-h-[200px] overflow-auto">
              {loading && options.length === 0 ? (
                <div className="flex justify-center items-center py-2">
                  <Spinner size="sm" />
                </div>
              ) : (
                options.map(option => renderOptionItem(option))
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
