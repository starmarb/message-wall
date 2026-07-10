const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 300;

interface Point {
  x: number;
  y: number;
}

interface Line {
  points: Point[];
  brushColor?: string;
  brushRadius?: number;
  eraser?: boolean;
}

interface SaveData {
  lines: Line[];
  width?: number;
  height?: number;
}

function parseSaveData(saveDataString: string): SaveData {
  try {
    let parsed: unknown = JSON.parse(saveDataString);
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as SaveData).lines)
    ) {
      return parsed as SaveData;
    }
  } catch {
    // fall through to empty
  }
  return { lines: [], width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
}

function isEraserLine(line: Line): boolean {
  return (
    line.eraser === true ||
    line.brushColor === "rgba(0,0,0,0)" ||
    line.brushColor === "transparent"
  );
}

export interface AnimateOptions {
  width?: number;
  height?: number;
  background?: string;
  /** Total time to reveal the whole drawing. Auto-scales with complexity if omitted. */
  durationMs?: number;
  strokeMultiplier?: number;
  onDone?: () => void;
  /** Skip the animation and draw the finished result immediately. */
  instant?: boolean;
}

/**
 * Progressively replays a react-canvas-draw saveData string onto a canvas,
 * one point at a time, so the drawing appears to be drawn stroke-by-stroke
 * rather than popping in all at once.
 *
 * Returns a cleanup function that cancels the animation (call on unmount or
 * before starting a new one on the same canvas).
 */
export function animateSaveDataToCanvas(
  canvas: HTMLCanvasElement,
  saveDataString: string,
  opts: AnimateOptions = {},
): () => void {
  const data = parseSaveData(saveDataString);
  const usableLines = (data.lines ?? []).filter(
    (line) => Array.isArray(line.points) && line.points.length >= 2,
  );

  const originalWidth = Number(data.width) || DEFAULT_WIDTH;
  const originalHeight = Number(data.height) || DEFAULT_HEIGHT;
  const targetWidth = opts.width ?? originalWidth;
  const targetHeight = opts.height ?? originalHeight;
  const background = opts.background ?? "transparent";
  const multiplier = opts.strokeMultiplier ?? 1.8;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(targetWidth * dpr);
  canvas.height = Math.round(targetHeight * dpr);

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const scale = Math.min(targetWidth / originalWidth, targetHeight / originalHeight);
  const offsetX = (targetWidth - originalWidth * scale) / 2;
  const offsetY = (targetHeight - originalHeight * scale) / 2;

  const totalPoints = usableLines.reduce((sum, l) => sum + l.points.length, 0);

  if (totalPoints === 0) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    if (background !== "transparent") {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }
    opts.onDone?.();
    return () => {};
  }

  const duration =
    opts.durationMs ?? Math.min(4000, Math.max(900, totalPoints * 4));

  if (opts.instant) {
    drawFrame(totalPoints);
    opts.onDone?.();
    return () => {};
  }

  let cancelled = false;
  let rafId: number;
  const start = performance.now();

  function drawFrame(pointBudget: number) {
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, targetWidth, targetHeight);
    if (background !== "transparent") {
      ctx!.fillStyle = background;
      ctx!.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx!.save();
    ctx!.translate(offsetX, offsetY);
    ctx!.scale(scale, scale);

    let remaining = pointBudget;
    for (const line of usableLines) {
      if (remaining <= 0) break;
      const pts = line.points;
      const countToDraw = Math.min(pts.length, remaining);
      if (countToDraw < 2) {
        remaining -= countToDraw;
        continue;
      }

      ctx!.lineJoin = "round";
      ctx!.lineCap = "round";

      if (isEraserLine(line)) {
        ctx!.globalCompositeOperation = "destination-out";
        ctx!.strokeStyle = "rgba(0,0,0,1)";
      } else {
        ctx!.globalCompositeOperation = "source-over";
        ctx!.strokeStyle = line.brushColor ?? "#ffffff";
      }

      const brushRadius = line.brushRadius ?? 2;
      const enlarged = brushRadius * multiplier;
      const relativeRatio = enlarged / originalWidth;
      ctx!.lineWidth = relativeRatio * targetWidth;

      ctx!.beginPath();
      ctx!.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < countToDraw; i++) {
        ctx!.lineTo(pts[i].x, pts[i].y);
      }
      ctx!.stroke();

      remaining -= countToDraw;
    }

    ctx!.restore();
  }

  function tick(now: number) {
    if (cancelled) return;
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / duration);
    const pointBudget = Math.floor(progress * totalPoints);
    drawFrame(pointBudget);

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      opts.onDone?.();
    }
  }

  rafId = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
  };
}
