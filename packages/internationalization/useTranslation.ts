'use client'

import { useTranslations as useIntlTranslations } from 'next-intl'

export const useTranslation = (namespace: string) => {
  const t = useIntlTranslations(namespace)
  return { t }
}
