"use client";

import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import opentype from "opentype.js";

function TextToSvgPathsPerCharacter({
  text,
  fontUrl,
  fontSize = 72, // Default font size in SVG units
  x = 0, // Initial X position of the baseline start
  y = 0, // Y position of the baseline start (consistent for all chars)
  fill = "black", // Default fill color
  stroke = "none", // Default stroke color
  strokeWidth = 0, // Default stroke width
  svgProps = {}, // Allow passing additional props to the <svg> element
  pathProps = {}, // Allow passing additional props to EACH <path> element
  // Optional function to customize props for each character's path
  getPathProps = (char, index, defaultProps) => defaultProps,
}: {
  text: string;
  fontUrl: string;
  fontSize?: number;
  x?: number;
  y?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  svgProps?: object;
  pathProps?: { className?: string };
  getPathProps?: (char: string, index: number, defaultProps: object) => object;
}) {
  const [font, setFont] = useState<opentype.Font | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Effect to load the font file (same as before)
  useEffect(() => {
    setLoading(true);
    setError(null);
    setFont(null);

    if (!fontUrl) {
      setError(new Error("Font URL is required."));
      setLoading(false);
      return;
    }

    opentype.load(fontUrl, (err, loadedFont) => {
      if (err) {
        console.error("Font loading failed:", err);
        setError(new Error(`Failed to load font: ${err.message || err}`));
      } else {
        setFont(loadedFont ?? null);
        setError(null);
      }
      setLoading(false);
    });
  }, [fontUrl]);

  // Memoize the path generation and viewBox calculation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { characterPaths, viewBox, calculatedWidth, calculatedHeight } =
    useMemo(() => {
      if (!font || !text) {
        return {
          characterPaths: [],
          viewBox: "0 0 0 0",
          calculatedWidth: 0,
          calculatedHeight: 0,
        };
      }

      try {
        const individualPaths = [];
        let currentX = x; // Start at the initial x offset
        const scale = fontSize / font.unitsPerEm;
        const glyphs = font.stringToGlyphs(text); // Get all glyphs with info

        // --- Generate paths for each character, respecting kerning ---
        for (let i = 0; i < glyphs.length; i++) {
          const glyph = glyphs[i];
          const char = text[i]; // Get the original character

          // Apply kerning adjustment if not the first character
          if (i > 0) {
            const kerning = font.getKerningValue(glyphs[i - 1], glyph);
            if (kerning) {
              currentX += kerning * scale;
            }
          }

          // Generate path for the single character at the current position
          // Need to handle potential errors if a character doesn't have a path
          let charPathData = "";
          try {
            // Use empty string if character is whitespace or has no outline
            if (char.trim() !== "") {
              const path = font.getPath(char, currentX, y, fontSize);
              charPathData = path.toPathData(2); // 2 decimal places
            }
          } catch (charError) {
            console.warn(
              `Could not generate path for character "${char}" at index ${i}:`,
              charError
            );
          }

          individualPaths.push({
            d: charPathData,
            char: char,
            index: i,
            x: currentX, // Store starting x for this char path
          });

          // Advance currentX for the next character based on the glyph's advance width
          if (glyph.advanceWidth) {
            currentX += glyph.advanceWidth * scale;
          }
          // Note: We don't add kerning here, it was added *before* positioning the current glyph.
        }

        // --- Calculate overall viewBox using the combined path ---
        // This ensures the viewBox correctly contains the full text layout
        let overallViewBox = "0 0 0 0";
        let width = 0;
        let height = 0;
        try {
          const combinedPath = font.getPath(text, x, y, fontSize);
          const bb = combinedPath.getBoundingBox();
          const vbX = bb.x1;
          const vbY = bb.y1;
          width = bb.x2 - bb.x1 + 40;
          height = bb.y2 - bb.y1 + 20;

          overallViewBox = [vbX, vbY, width, height]
            .map((n) => Math.round(n * 100) / 100)
            .join(" ");
        } catch (bboxError) {
          console.error("Could not calculate overall bounding box:", bboxError);
          // Fallback: try to estimate from final currentX? Less reliable.
          width = currentX - x ;
          height = fontSize * 1.2 ; // Rough estimate
          overallViewBox = `${x} ${y - fontSize} ${width} ${height}`;
        }

        return {
          characterPaths: individualPaths,
          viewBox: overallViewBox,
          calculatedWidth: width,
          calculatedHeight: height,
        };
      } catch (err) {
        console.error("Error generating paths:", err);
        return {
          characterPaths: [],
          viewBox: "0 0 0 0",
          calculatedWidth: 0,
          calculatedHeight: 0,
        };
      }
    }, [font, text, x, fontSize, y]); // Recalculate if these change

  // --- Rendering Logic ---

  if (loading) {
    return <div>Loading font...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error.message}</div>;
  }

  if (!font) {
    return null; // Font not ready
  }

  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      {...svgProps} // Spread any additional SVG props
    >
      {/* Add a title for accessibility */}
      <title>{text}</title>

      {/* Render each character path */}
      {characterPaths.map((charData, index) => {
        // Skip rendering if path data is empty (e.g., for whitespace)
        if (!charData.d) {
          return null;
        }

        // Prepare default props for this path
        const defaultPropsForPath = {
          key: `${charData.char}-${index}`, // Unique key for React
          d: charData.d,
          fill: fill,
          stroke: stroke,
          strokeWidth: strokeWidth,
          "data-char": charData.char, // Add data attributes
          "data-index": charData.index,
          ...pathProps, // Spread common path props
        };

        // Allow customization via getPathProps function
        const finalPathProps = getPathProps(
          charData.char,
          index,
          defaultPropsForPath
        );

        return <path className="line" {...finalPathProps} key={index} transform="translate(20, 10)" />;
      })}
    </svg>
  );
}

// --- PropTypes ---

TextToSvgPathsPerCharacter.propTypes = {
  /** The text string to render */
  text: PropTypes.string.isRequired,
  /** URL to the font file (TTF, OTF, WOFF, WOFF2). Must be accessible (CORS). */
  fontUrl: PropTypes.string.isRequired,
  /** Font size in SVG units. Affects path coordinates and kerning calculation. */
  fontSize: PropTypes.number,
  /** Initial X coordinate for the start of the text baseline. */
  x: PropTypes.number,
  /** Y coordinate for the start of the text baseline (applied to all characters). */
  y: PropTypes.number,
  /** Default fill color for the text outlines. */
  fill: PropTypes.string,
  /** Default stroke color for the text outlines. */
  stroke: PropTypes.string,
  /** Default stroke width for the text outlines. */
  strokeWidth: PropTypes.number,
  /** Additional props to pass to the <svg> element */
  svgProps: PropTypes.object,
  /** Additional props to pass to EACH individual <path> element */
  pathProps: PropTypes.object,
  /** Optional function to customize props for each character's path. Receives (character, index, defaultProps) and should return props object. */
  getPathProps: PropTypes.func,
};

export default TextToSvgPathsPerCharacter;
