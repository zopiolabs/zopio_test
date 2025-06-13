export const getDictionary = async (locale: string) => {
    const dictionary = await import(`./dictionaries/${locale}.json`).then(m => m.default)
    return dictionary
  }
  