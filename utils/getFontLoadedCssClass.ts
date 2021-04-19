import { kebabCase } from "./kebabCase";

export const getFontLoadedCssClass = (name: string, variant?: string | number) => {
  if (variant) {
    return `wf-${kebabCase(name)}-${kebabCase(variant.toString())}--loaded`
  }

  return `wf-${kebabCase(name)}--loaded`
}