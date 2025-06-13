import React, { useState } from "react";
import type { FieldValue } from "../types";
import { fieldComponentMap } from "./fieldComponentMap";
import type { AutoFormProps, FieldDefinition, FormSection } from "../types";
import { useCrudTranslation } from "../i18n";

/**
 * AutoForm renders a form by mapping field types to shadcn/ui components.
 * Supports internationalization, form layouts, and advanced field types.
 */
export function AutoForm({
  fields,
  value,
  onChange,
  errors = {},
  layout,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  resetLabel,
  showReset = true,
  className = "",
}: AutoFormProps) {
  const { t } = useCrudTranslation();
  const [activeTab, setActiveTab] = useState(0);

  // Handle conditional fields visibility
  const getVisibleFields = (fieldList: FieldDefinition[]) => {
    return fieldList.filter(field => {
      if (typeof field.hidden === 'function') {
        return !field.hidden(value);
      }
      return !field.hidden;
    });
  };

  // Determine if a field is read-only
  const isReadOnly = (field: FieldDefinition) => {
    if (typeof field.readOnly === 'function') {
      return field.readOnly(value);
    }
    return !!field.readOnly;
  };

  // Render a single field
  const renderField = (field: FieldDefinition) => {
    const FieldComponent = fieldComponentMap[field.type] || fieldComponentMap.string;
    const isRequired = !!field.required;
    const fieldId = `field-${field.name}`;
    
    return (
      <div key={field.name} className="mb-4">
        <label htmlFor={fieldId} className="block text-sm font-medium mb-1">
          {t(`fields.${field.name}.label`, { defaultValue: field.label || field.name })}
          {isRequired && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
        
        {field.description && (
          <p className="text-sm text-gray-500 mb-2">
            {t(`fields.${field.name}.description`, { defaultValue: field.description })}
          </p>
        )}
        
        <FieldComponent
          id={fieldId}
          name={field.name}
          value={value[field.name]}
          onChange={(e: React.ChangeEvent<HTMLInputElement> | FieldValue) =>
            onChange({
              ...value,
              [field.name]: e && typeof e === 'object' && 'target' in e ? e.target.value : e
            })}
          placeholder={t(`fields.${field.name}.placeholder`, { defaultValue: field.placeholder || '' })}
          disabled={isReadOnly(field) || isSubmitting}
          required={isRequired}
          aria-invalid={!!errors[field.name]}
          aria-describedby={errors[field.name] ? `${fieldId}-error` : undefined}
          {...field.props}
        />
        
        {errors[field.name] && (
          <div id={`${fieldId}-error`} className="text-red-500 text-xs mt-1" role="alert">
            {t(`fields.${field.name}.errors.${errors[field.name]}`, { defaultValue: errors[field.name] })}
          </div>
        )}
      </div>
    );
  };

  // Render a section of fields
  const renderSection = (section: FormSection) => {
    const visibleFields = getVisibleFields(
      fields.filter(f => section.fields.includes(f.name))
    );
    
    const gridCols = section.columns || 1;
    const gridClass = {
      1: '',
      2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      3: 'grid grid-cols-1 md:grid-cols-3 gap-4',
      4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
    }[gridCols] || '';

    return (
      <div key={section.title || 'default-section'} className="mb-6">
        {section.title && (
          <h3 className="text-lg font-medium mb-3">
            {t(`form.sections.${section.title}`, { defaultValue: section.title })}
          </h3>
        )}
        
        {section.description && (
          <p className="text-sm text-gray-500 mb-4">
            {t(`form.sections.${section.title}.description`, { defaultValue: section.description })}
          </p>
        )}
        
        <div className={gridClass}>
          {visibleFields.map(renderField)}
        </div>
      </div>
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  // Render the form based on layout or default to simple list
  const renderFormContent = () => {
    // If using tabs layout
    if (layout?.tabs) {
      return (
        <>
          <div className="flex border-b mb-6" role="tablist">
            {layout.tabs.map((tab, index) => (
              <button
                key={tab.title}
                type="button"
                role="tab"
                aria-selected={activeTab === index}
                aria-controls={`tab-panel-${index}`}
                id={`tab-${index}`}
                className={`py-2 px-4 font-medium ${
                  activeTab === index
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {t(`form.tabs.${tab.title}`, { defaultValue: tab.title })}
              </button>
            ))}
          </div>
          
          <div 
            role="tabpanel"
            id={`tab-panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {layout.tabs[activeTab].sections.map(renderSection)}
          </div>
        </>
      );
    }
    
    // If using sections layout
    if (layout?.sections) {
      return layout.sections.map(renderSection);
    }
    
    // Default layout: all fields in a single column
    return (
      <div>
        {getVisibleFields(fields).map(renderField)}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={className} noValidate={!!onSubmit}>
      {renderFormContent()}
      
      {onSubmit && (
        <div className="flex justify-end space-x-2 mt-6">
          {showReset && (
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => onChange({})}
              disabled={isSubmitting}
            >
              {t('form.reset', { defaultValue: resetLabel || 'Reset' })}
            </button>
          )}
          
          <button
            type="submit"
            className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg 
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('form.submitting', { defaultValue: 'Submitting...' })}
              </span>
            ) : (
              t('form.submit', { defaultValue: submitLabel || 'Submit' })
            )}
          </button>
        </div>
      )}
    </form>
  );
}