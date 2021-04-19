import React from "react"
import { arrayCheck, FontConfig } from "../utils";

export const getTestFonts = (fontConfigs: FontConfig[]) => {
  const fontSpans = []

  const hiddenStyles: React.CSSProperties = {
    position: "absolute",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    height: "1px",
    width: "1px",
    margin: "-1px",
    padding: "0",
    border: "0",
  }

  fontConfigs.forEach(fontConfig => {
    if (arrayCheck(fontConfig.weights)) {
      fontConfig.weights.forEach((weight) => {
        fontSpans.push(
          <span
            key={`wf-test-${fontConfig.name}-${weight}`}
            aria-hidden="true"
            style={{ ...hiddenStyles, fontFamily: `"${fontConfig.name}"`, fontWeight: weight }}
          >
        &nbsp;
      </span>
        )
      })
    } else {
      fontSpans.push(
        <span
          key={`wf-test-${fontConfig.name}`}
          aria-hidden="true"
          style={{ ...hiddenStyles, fontFamily: `"${fontConfig.name}"` }}
        >
        &nbsp;
      </span>
      )
    }
  })
  console.log(fontSpans)
  return (
    <span key="wf-test-wrapper" style={hiddenStyles}>
      {fontSpans}
    </span>
  )
}
