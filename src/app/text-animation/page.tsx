"use client";

import TextToSvgPath from "@/components/text2svgpath";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { animate, stagger, svg } from "animejs";
import { useEffect, useRef, useState } from "react";

const myFontUrl = "/fonts/aller.italic.ttf";

export default function TextAnimation() {
  const iref = useRef<HTMLInputElement>(null);
  const [textToRender, setTextToRender] = useState("AnimationAPI");
  const [prep, setprep] = useState(false);
  useEffect(() => {
    setTextToRender(iref.current?.value ?? "Problem");
    if (prep) {
      setTimeout(() => setprep(false), 100);
    }
  }, [prep]);

  function animateT() {
    setTextToRender(iref.current?.value ?? "Problem");
    setTimeout(() => {
      const drawables = svg.createDrawable(`.line`);

      animate(drawables, {
        draw: ["0 0", "0 1", "1 1"],
        ease: "inOutQuad",
        duration: 5000,
        delay: stagger(100),
        loop: true,
      });
    }, 150);
  }

  return (
    <div className=" container mx-auto items-center justify-center flex flex-col mt-20 gap-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Text Animation
      </h1>
      <Input
        ref={iref}
        className=" w-80 text-center"
        defaultValue={"AnimationAPI"}
      ></Input>
      <div className=" flex gap-2">
        <Button
          onClick={() => {
            animateT();
          }}
        >
          Animate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setprep(true);
          }}
        >
          Static
        </Button>
      </div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10">
        Rendered Text
      </h2>
      {!prep && (
        <TextToSvgPath
          text={textToRender}
          fontUrl={myFontUrl}
          fontSize={100} // Large font size for visibility
          // x={10} // Optional horizontal offset
          y={100} // Adjust baseline Y position (opentype.js uses baseline)
          fill="none"
          stroke="#2B759B"
          strokeWidth={3}
          svgProps={{
            style: { width: "auto", maxHeight: "400px" }, // Make SVG responsive
            id: `id_${Math.random()}`,
          }}
          pathProps={{
            // Example: add a class for CSS styling
            className: `line`,
          }}
        />
      )}
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10">
        Actual Text
      </h2>
      <p style={{
        fontFamily: "AllerItalic"
      }}>{textToRender}</p>

      {/* <h2>Another Example:</h2>
      <TextToSvgPath
        text="Outlined"
        fontUrl="/fonts/aller.italic.ttf" // Use a different font
        fontSize={80}
        y={80} // Adjust baseline
        fill="none" // No fill
        stroke="red"
        strokeWidth={2}
        svgProps={{
          style: { width: "300px", height: "100px", marginTop: "20px" },
        }}
      /> */}
    </div>
  );
}
