export interface FontConfig {
  name: string
  weights?: string[]
}

export const getFontConfigs = (
  allFonts: { fontConfigs: FontConfig[] }[]
): FontConfig[] => {
  const allFontConfigs = []
  allFonts.forEach(({ fontConfigs }) => allFontConfigs.push(...fontConfigs))
  return allFontConfigs
}
