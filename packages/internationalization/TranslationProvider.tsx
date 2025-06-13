'use client'

import { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'

type Props = {
  children: ReactNode
  locale: string
  messages: Record<string, any>
}

export function TranslationProvider({ children, locale, messages }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
