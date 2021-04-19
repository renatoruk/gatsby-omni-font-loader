import { FontConfig } from "./getFontConfigs";
import { FontVariant } from "../interfaces/FontVariant";
import { flatten } from "./flatten";
import { getFontLoadedCssClass } from "./getFontLoadedCssClass";
import { arrayCheck } from "./arrayCheck";

export const getFontVariants = (fontConfigs: FontConfig[]): FontVariant[] => {
  const variants = fontConfigs.map((fontConfig) => {
    if (arrayCheck(fontConfig.weights)) {
      return fontConfig.weights.map((variant): FontVariant => {
        return {
          fontName: fontConfig.name,
          weight: variant,
          className: getFontLoadedCssClass(fontConfig.name, variant)
        }
      })
    }

    return {
      fontName: fontConfig.name,
      className: getFontLoadedCssClass(fontConfig.name)
    }
  })

  return flatten(variants)
}