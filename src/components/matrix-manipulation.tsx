"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Slider } from "@/components/ui/slider";

export default function TransformPlayground() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const [rotate, setRotate] = useState(0);

  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  const [originX, setOriginX] = useState("0%");
  const [originY, setOriginY] = useState("0%");

  const [anchorX, setAnchorX] = useState(100);
  const [anchorY, setAnchorY] = useState(100);

  const [use3D, setUse3D] = useState(false);
  const [lockAnchorOnResize, ] = useState(false);
  const [matrix, setMatrix] = useState("none");
  const [log, setLog] = useState<string[]>([]);

  const prevSize = useRef({ width, height });

  useEffect(() => {
    const steps = [];
    const angle = (rotate * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    steps.push(`Rotate ${rotate}° -> cos=${cos.toFixed(3)}, sin=${sin.toFixed(3)}`);

    const dx = anchorX;
    const dy = anchorY;
    steps.push(`Anchor at (${dx}, ${dy})`);

    // Handle anchor correction on resize
    if (lockAnchorOnResize) {
      const dw = width - prevSize.current.width;
      const dh = height - prevSize.current.height;

      const offsetX = dw * (anchorX / prevSize.current.width);
      const offsetY = dh * (anchorY / prevSize.current.height);

      setTranslateX(prev => prev - offsetX);
      setTranslateY(prev => prev - offsetY);

      steps.push(`Resize delta: (${dw}, ${dh})`);
      steps.push(`Adjusting translate by: (${offsetX.toFixed(2)}, ${offsetY.toFixed(2)})`);
    }

    prevSize.current = { width, height };

    const a = scaleX * cos;
    const b = scaleX * sin;
    const c = -scaleY * sin;
    const d = scaleY * cos;

    const tx = -dx * a - dy * c + dx + translateX;
    const ty = -dx * b - dy * d + dy + translateY;

    steps.push(`Transformed matrix components:`);
    steps.push(`a=${a.toFixed(5)}, b=${b.toFixed(5)}, c=${c.toFixed(5)}, d=${d.toFixed(5)}, e=${tx.toFixed(2)}, f=${ty.toFixed(2)}`);

    const m2d = `matrix(${a.toFixed(5)}, ${b.toFixed(5)}, ${c.toFixed(5)}, ${d.toFixed(5)}, ${tx.toFixed(2)}, ${ty.toFixed(2)})`;
    const m3d = `matrix3d(${a.toFixed(5)}, ${b.toFixed(5)}, 0, 0, ${c.toFixed(5)}, ${d.toFixed(5)}, 0, 0, 0, 0, 1, 0, ${tx.toFixed(2)}, ${ty.toFixed(2)}, 0, 1)`;

    setMatrix(use3D ? m3d : m2d);
    setLog(steps);
  }, [translateX, translateY, rotate, scaleX, scaleY, anchorX, anchorY, use3D, width, height, lockAnchorOnResize]);

  return (
    <div className=" relative p-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Transform Controls</h2>

        <div>
          <label className="block mb-1">Width: {width}px</label>
          <Slider min={50} max={300} step={1} value={[width]} onValueChange={([v]) => setWidth(v)} />
        </div>

        <div>
          <label className="block mb-1">Height: {height}px</label>
          <Slider min={50} max={300} step={1} value={[height]} onValueChange={([v]) => setHeight(v)} />
        </div>

        <div>
          <label className="block mb-1">Translate X: {translateX}px</label>
          <Slider min={-200} max={200} value={[translateX]} onValueChange={([v]) => setTranslateX(v)} />
        </div>

        <div>
          <label className="block mb-1">Translate Y: {translateY}px</label>
          <Slider min={-200} max={200} value={[translateY]} onValueChange={([v]) => setTranslateY(v)} />
        </div>

        <div>
          <label className="block mb-1">Rotate: {rotate}°</label>
          <Slider min={-180} max={180} value={[rotate]} onValueChange={([v]) => setRotate(v)} />
        </div>

        <div>
          <label className="block mb-1">Scale X: {scaleX}</label>
          <Slider min={-3} max={3} step={0.01} value={[scaleX]} onValueChange={([v]) => setScaleX(v)} />
        </div>

        <div>
          <label className="block mb-1">Scale Y: {scaleY}</label>
          <Slider min={-3} max={3} step={0.01} value={[scaleY]} onValueChange={([v]) => setScaleY(v)} />
        </div>

        <div>
          <label className="block mb-1">Transform Origin X</label>
          <select value={originX} onChange={(e) => setOriginX(e.target.value)} className="border p-1 rounded">
            <option value="0%">0%</option>
            <option value="50%">50%</option>
            <option value="100%">100%</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Transform Origin Y</label>
          <select value={originY} onChange={(e) => setOriginY(e.target.value)} className="border p-1 rounded">
            <option value="0%">0%</option>
            <option value="50%">50%</option>
            <option value="100%">100%</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Anchor X: {anchorX}px</label>
          <Slider min={0} max={300} step={1} value={[anchorX]} onValueChange={([v]) => setAnchorX(v)} />
        </div>

        <div>
          <label className="block mb-1">Anchor Y: {anchorY}px</label>
          <Slider min={0} max={300} step={1} value={[anchorY]} onValueChange={([v]) => setAnchorY(v)} />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" checked={use3D} onChange={(e) => setUse3D(e.target.checked)} />
          <label>Use 3D Matrix</label>
        </div>

        {/* <div className="flex items-center gap-2">
          <input type="checkbox" checked={lockAnchorOnResize} onChange={(e) => setLockAnchorOnResize(e.target.checked)} />
          <label>Lock Anchor During Resize</label>
        </div> */}

        <div className="mt-4">
          <strong>Matrix:</strong>
          <div className="font-mono bg-gray-100 p-2 mt-1 rounded text-sm break-all">{matrix}</div>
        </div>

        <div className="mt-4">
          <strong>Steps:</strong>
          <ul className="text-sm list-disc ml-6 space-y-1">
            {log.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>
      </div>

      <div className="flex sticky top-10 items-center justify-center h-[600px] bg-gray-50 border rounded">
        <div
          className="bg-blue-500 text-white flex items-center justify-center"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: matrix,
            transformOrigin: `${originX} ${originY}`,
          }}
        >
          <div className="flex items-center justify-center absolute -translate-[50%] font-semibold text-black size-fit" style={{
            top: `${originY}`,
            left: `${originX}`,
            transform: `scale(${1/scaleX}, ${1/scaleY}) rotate(${-rotate}deg)`,
            transformOrigin: 'center'
          }}>
            o
          </div>
          <div className="flex items-center justify-center absolute -translate-[50%] font-semibold text-black size-fit" style={{
            top: `${parseFloat(originY)*height/100 + anchorY}px`,
            left: `${parseFloat(originX)*width/100 + anchorX}px`,
            transform: `scale(${1/scaleX}, ${1/scaleY}) rotate(${-rotate}deg)`,
            transformOrigin: 'center'
          }}>
            +
          </div>
        </div>
      </div>
    </div>
  );
}
