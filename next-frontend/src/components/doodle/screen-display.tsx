"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { animateSaveDataToCanvas } from "@/utils/animate-canvas";

export interface ScreenDisplayDrawing {
  id: string;
  saveData: string;
}

const MAX_FRAME_IMAGES = 20;
const CENTER_HOLD_MS = 1200;

interface FramePosition {
  xPct: number;
  yPct: number;
}

// 20 evenly spaced slots walking the border of the frame: 6 across the top,
// 4 down the right, 6 across the bottom, 4 up the left.
function buildFramePositions(): FramePosition[] {
  const positions: FramePosition[] = [];
  const topXs = [8, 24.8, 41.6, 58.4, 75.2, 92];
  const bottomXs = [92, 75.2, 58.4, 41.6, 24.8, 8];
  const rightYs = [28, 46.6, 65.2, 84];
  const leftYs = [84, 65.2, 46.6, 28];

  topXs.forEach((x) => positions.push({ xPct: x, yPct: 12 }));
  rightYs.forEach((y) => positions.push({ xPct: 92, yPct: y }));
  bottomXs.forEach((x) => positions.push({ xPct: x, yPct: 92 }));
  leftYs.forEach((y) => positions.push({ xPct: 8, yPct: y }));

  return positions;
}

const FRAME_POSITIONS = buildFramePositions();

function FrameThumbnail({
  drawing,
  cellSize,
}: {
  drawing: ScreenDisplayDrawing;
  cellSize: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    animateSaveDataToCanvas(canvasRef.current, drawing.saveData, {
      width: cellSize,
      height: cellSize,
      background: "transparent",
      strokeMultiplier: 2,
      instant: true,
    });
  }, [drawing.saveData, cellSize]);

  return (
    <canvas
      ref={canvasRef}
      className="animate-fade-in-frame"
      style={{ width: cellSize, height: cellSize, display: "block" }}
    />
  );
}

export function ScreenDisplay({
  drawing,
}: {
  drawing: ScreenDisplayDrawing | null;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const centerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frameQueue, setFrameQueue] = useState<ScreenDisplayDrawing[]>([]);
  const [centerDrawing, setCenterDrawing] = useState<ScreenDisplayDrawing | null>(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 540 });

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // New submission: show it centered with the stroke-by-stroke reveal, then
  // fold it into the perimeter frame queue (max 20, oldest drops off).
  useEffect(() => {
    if (!drawing) return;
    setCenterDrawing(drawing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawing?.id]);

  // Runs only once centerDrawing has actually caused the <canvas> to mount,
  // so the ref below is guaranteed to be attached.
  useEffect(() => {
    if (!centerDrawing || !centerCanvasRef.current) return;

    let foldTimer: ReturnType<typeof setTimeout>;
    const cancelAnim = animateSaveDataToCanvas(centerCanvasRef.current, centerDrawing.saveData, {
      width: centerSize,
      height: centerSize,
      background: "transparent",
      strokeMultiplier: 2.4,
      onDone: () => {
        foldTimer = setTimeout(() => {
          setFrameQueue((prev) => {
            const next = [...prev, centerDrawing];
            return next.length > MAX_FRAME_IMAGES
              ? next.slice(next.length - MAX_FRAME_IMAGES)
              : next;
          });
          setCenterDrawing(null);
        }, CENTER_HOLD_MS);
      },
    });

    return () => {
      cancelAnim();
      if (foldTimer) clearTimeout(foldTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerDrawing?.id]);

  const frameSize = Math.min(dimensions.width * 0.12, dimensions.height * 0.15);
  const centerSize = Math.min(dimensions.width * 0.25, dimensions.height * 0.4);
  // Mirrors the original clamp(2rem, 6vw, 5rem) but scaled to this panel's
  // own width rather than the page's viewport width, since here the panel
  // is a smaller mockup rather than a fullscreen TV.
  const headerFontSize = Math.min(72, Math.max(18, dimensions.width * 0.045));

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "3%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Copperplate, "Copperplate Gothic Light", serif',
            letterSpacing: 3,
            color: "#1f2937",
            fontSize: `${headerFontSize}px`,
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          MESSAGE WALL
        </Typography>
      </Box>

      <Box ref={containerRef} sx={{ position: "absolute", inset: 0 }}>
        {frameQueue.map((d, i) => {
          const pos = FRAME_POSITIONS[i % FRAME_POSITIONS.length];
          return (
            <Box
              key={d.id}
              sx={{
                position: "absolute",
                left: `${pos.xPct}%`,
                top: `${pos.yPct}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <FrameThumbnail drawing={d} cellSize={frameSize} />
            </Box>
          );
        })}

        {centerDrawing && (
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 3,
            }}
          >
            <canvas
              ref={centerCanvasRef}
              style={{ width: centerSize, height: centerSize, display: "block" }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
