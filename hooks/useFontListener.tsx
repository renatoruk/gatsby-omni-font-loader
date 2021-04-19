import { useEffect, useMemo, useRef, useState } from "react"
import { FontConfig, kebabCase } from "../utils"
import { FontVariant } from "../interfaces/FontVariant";
import { getFontVariants } from "../utils/getFontVariants";

declare var document: { fonts: any }

export type hookOptions = {
  fontConfigs: FontConfig[]
  interval: number
  timeout: number
  scope: string
}

type fontListenerHook = (options: hookOptions) => void

export const useFontListener: fontListenerHook = ({
  fontConfigs,
  interval,
  timeout,
  scope,
}) => {
  const [hasLoaded, setHasLoaded] = useState<Boolean>(false)
  const [loadedFonts, setLoadedFonts] = useState<FontVariant[]>([])
  const [intervalId, setIntervalId] = useState<number>(-1)
  const attempts = useRef<number>(Math.floor(timeout / interval))

  const hasFonts = fontConfigs && Boolean(fontConfigs.length)
  const fontVariants: FontVariant[] = useMemo<FontVariant[]>(() => {
    return getFontVariants(fontConfigs)
  }, [fontConfigs]);

  const pendingFonts: FontVariant[] = useMemo(
    () => fontVariants.filter(variant => !loadedFonts.find(
      loadedVariant => loadedVariant.className === variant.className)
    ),
    [loadedFonts, fontVariants]
  )
  const targetElement = useMemo(
    () => (scope === "html" ? "documentElement" : "body"),
    [scope]
  )

  const apiAvailable = "fonts" in document

  useEffect(() => {
    if (!apiAvailable) {
      handleApiError("Font loading API not available")
      return
    }

    if (hasFonts && apiAvailable && !hasLoaded && intervalId < 0) {
      const id = window.setInterval(isFontLoaded, interval)
      setIntervalId(id)
    }
  }, [hasFonts, hasLoaded, intervalId, apiAvailable])

  useEffect(() => {
    if (hasLoaded && intervalId > 0) {
      clearInterval(intervalId)
    }
  }, [hasLoaded, intervalId])

  function errorFallback() {
    setHasLoaded(true)
    setLoadedFonts(fontVariants)
    fontVariants.forEach(addClassName)
  }

  function handleApiError(error) {
    console.info(`document.fonts API error: ${error}`)
    console.info(`Replacing fonts instantly. FOUT handling failed.`)
    errorFallback()
  }

  function addClassName(fontVariant: FontVariant) {
    document[targetElement].classList.add(fontVariant.className)
  }

  function isFontLoaded() {
    const loaded: FontVariant[] = []
    attempts.current = attempts.current - 1

    if (attempts.current < 0) {
      handleApiError("Interval timeout reached, maybe due to slow connection.")
    }

    const fontsLoading: boolean[] = pendingFonts.map(fontVariant => {
      let hasLoaded = false
      try {
        if (fontVariant.weight) {
          hasLoaded = document.fonts.check(`${fontVariant.weight} 12px '${fontVariant.fontName}'`)
        } else {
          hasLoaded = document.fonts.check(`12px '${fontVariant.fontName}'`)
        }
      } catch (error) {
        handleApiError(error)
        return
      }

      if (hasLoaded) {
        addClassName(fontVariant)
        loaded.push(fontVariant)
      }

      return hasLoaded
    })

    const allFontsLoaded = fontsLoading.every(font => font)

    if (Boolean(loaded.length)) {
      setLoadedFonts(loaded)
    }

    if (allFontsLoaded) {
      setHasLoaded(true)
    }
  }
}
