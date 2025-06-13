interface TranslationSet {
  title: string;
  description: string;
  button: string;
  save: string;
  cancel: string;
  [key: string]: string;
}

interface Translations {
  [locale: string]: TranslationSet;
}

export default function translationTemplate(namespace: string, locale: string): string {
  // Default translations for different locales based on memory
  const translations: Translations = {
    en: {
      title: 'Title',
      description: 'Description',
      button: 'Button',
      save: 'Save',
      cancel: 'Cancel'
    },
    tr: {
      title: 'Başlık',
      description: 'Açıklama',
      button: 'Düğme',
      save: 'Kaydet',
      cancel: 'İptal'
    },
    es: {
      title: 'Título',
      description: 'Descripción',
      button: 'Botón',
      save: 'Guardar',
      cancel: 'Cancelar'
    },
    de: {
      title: 'Titel',
      description: 'Beschreibung',
      button: 'Knopf',
      save: 'Speichern',
      cancel: 'Abbrechen'
    }
  };
  
  // Return the translations for the specified locale or fallback to English
  return JSON.stringify(translations[locale] || translations.en, null, 2);
}
