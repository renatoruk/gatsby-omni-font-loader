import { MODE_DEFAULT } from "./consts"
import { getFontConfig, getTestFonts } from "./generators"
import { getFontFiles, getFontConfigs } from "./utils"

export const onRenderBody = (
  { setHeadComponents, setPostBodyComponents },
  {
    enableListener,
    preconnect = [],
    preload = [],
    web = [],
    custom = [],
    mode = MODE_DEFAULT,
  }
) => {
  const allFonts = [...web, ...custom]
  const allPreloads = preload.concat(getFontFiles(allFonts))
  const fontConfigs = getFontConfigs(allFonts)

  const preloadConfig = getFontConfig(
    preconnect,
    allPreloads,
    mode === "async" ? [] : allFonts
  )

  if (enableListener && Boolean(allFonts.length) && mode === "async") {
    const testFontConfig = getTestFonts(fontConfigs)
    setPostBodyComponents(testFontConfig)
  }

  if (preloadConfig && Boolean(preloadConfig.length)) {
    setHeadComponents(preloadConfig)
  }
}
