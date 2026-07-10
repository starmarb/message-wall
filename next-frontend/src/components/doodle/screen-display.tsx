"use client";

import { useEffect, useRef, useState } from "react";
import { renderSaveDataToCanvas } from "@/utils/canvas";

export interface ScreenDisplayDrawing {
  id: string;
  saveData: string;
}

interface FloatingDrawing {
  id: string;
  saveData: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  timestamp: number;
}

const MAX_FRAME_IMAGES = 24;

/**
 * Faithful port of the original /display2 "floating drawings" page.
 * The only change from the original is that positioning/sizing is measured
 * from THIS component's own container instead of window.innerWidth/Height,
 * so it behaves identically whether shown fullscreen or in a panel.
 */
export function ScreenDisplay({ drawing }: { drawing: ScreenDisplayDrawing | null }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [floatingDrawings, setFloatingDrawings] = useState<FloatingDrawing[]>([]);
  const [processed, setProcessed] = useState<Set<string>>(new Set());
  const [dims, setDims] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setDims({ width: r.width, height: r.height });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const checkOverlap = (
    x: number,
    y: number,
    width: number,
    height: number,
  ): boolean => {
    const margin = 50;
    return floatingDrawings.some((d) => {
      const dx = Math.abs(x - d.x);
      const dy = Math.abs(y - d.y);
      return (
        dx < (width + d.width) / 2 + margin && dy < (height + d.height) / 2 + margin
      );
    });
  };

  const generateRandomPosition = (
    width: number,
    height: number,
  ): { x: number; y: number } => {
    let attempts = 0;
    const maxAttempts = 100;
    const viewportWidth = dims.width;
    const viewportHeight = dims.height;
    const headerHeight = 80;
    const margin = 30;

    while (attempts < maxAttempts) {
      const x = margin + Math.random() * (viewportWidth - width - margin * 2);
      const y =
        headerHeight +
        margin +
        Math.random() * (viewportHeight - headerHeight - height - margin * 2);
      if (!checkOverlap(x, y, width, height)) return { x, y };
      attempts++;
    }

    const corners = [
      { x: margin, y: headerHeight + margin },
      { x: viewportWidth - width - margin, y: headerHeight + margin },
      { x: margin, y: viewportHeight - height - margin },
      { x: viewportWidth - width - margin, y: viewportHeight - height - margin },
    ];
    return corners[Math.floor(Math.random() * corners.length)];
  };

  useEffect(() => {
    if (!drawing) return;
    if (processed.has(drawing.id)) return;

    const baseSize = Math.min(dims.width, dims.height) * 0.15;
    const sizeVariation = baseSize * 0.3;
    const containerSize = baseSize + (Math.random() * sizeVariation - sizeVariation / 2);
    const width = Math.max(containerSize, 120);
    const height = Math.max(containerSize, 120);
    const position = generateRandomPosition(width, height);

    const newDrawing: FloatingDrawing = {
      id: drawing.id,
      saveData: drawing.saveData,
      x: position.x,
      y: position.y,
      width,
      height,
      rotation: (Math.random() - 0.5) * 15,
      timestamp: Date.now(),
    };

    setFloatingDrawings((prev) => {
      const dedup = prev.filter((d) => d.id !== newDrawing.id);
      const next = [...dedup, newDrawing];
      if (next.length > MAX_FRAME_IMAGES) return next.slice(next.length - MAX_FRAME_IMAGES);
      return next;
    });
    setProcessed((prev) => new Set([...prev, drawing.id]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawing?.id, dims]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-white overflow-hidden relative"
    >
      {/* Header - MESSAGE WALL */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4">
        <h1
          className="text-gray-800 tracking-wider text-center"
          style={{
            fontFamily: 'Copperplate, "Copperplate Gothic Light", serif',
            fontSize: `clamp(1.25rem, 5cqw, 5rem)`,
          }}
        >
          MESSAGE WALL
        </h1>
      </div>

      {/* Floating drawings */}
      {floatingDrawings.map((d) => (
        <div
          key={`${d.id}-${d.timestamp}`}
          className="absolute z-20 animate-fade-in-frame"
          style={{
            left: d.x,
            top: d.y,
            width: d.width,
            height: d.height,
            transform: `rotate(${d.rotation}deg)`,
            WebkitTransform: `rotate(${d.rotation}deg)`,
            overflow: "visible",
            pointerEvents: "none",
            padding: "2px",
            boxSizing: "border-box",
          }}
        >
          <canvas
            ref={(el) => {
              if (el && d.width > 0 && d.height > 0) {
                el.width = d.width;
                el.height = d.height;
                renderSaveDataToCanvas(el, d.saveData, {
                  width: d.width,
                  height: d.height,
                  background: "transparent",
                  strokeMultiplier: 4,
                });
              }
            }}
            style={{ width: d.width, height: d.height, display: "block" }}
          />
        </div>
      ))}
    </div>
  );
}
