"use client";

import { useEffect, useRef } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { withBasePath } from "@/utils/base-path";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function renderSaveDataToCanvas(
  canvas: HTMLCanvasElement,
  saveDataString: string,
  opts: { width?: number; height?: number; background?: "transparent" | string } = {},
) {
  const data = JSON.parse(saveDataString);
  const cssWidth = (opts.width ?? Number(data.width)) || 640;
  const cssHeight = (opts.height ?? Number(data.height)) || 640;

  const dpr = Number(data.devicePixelRatio) || window.devicePixelRatio || 1;
  const background = opts.background ?? "#ffffff";

  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const srcW = Number(data.width) || cssWidth;
  const srcH = Number(data.height) || cssHeight;
  const scale = Math.min(cssWidth / srcW, cssHeight / srcH);

  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  if (background !== "transparent") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cssWidth, cssHeight);
  }
  ctx.restore();

  ctx.save();
  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);

  for (const line of data?.lines ?? []) {
    const pts = line?.points ?? [];
    if (pts.length < 2) continue;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = line?.brushColor ?? "#111827";
    ctx.lineWidth = (line?.brushRadius ?? 2) * 1.8;

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export interface SuccessViewProps {
  saveData: string;
}

export function SuccessView({ saveData }: SuccessViewProps) {
  const exportCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    (async () => {
      if (!saveData || !previewRef.current) return;

      renderSaveDataToCanvas(previewRef.current, saveData, {
        width: 640,
        height: 640,
        background: "#ffffff",
      });

      try {
        const data = JSON.parse(saveData);
        const cssW = 640;
        const cssH = 640;
        const dpr = Number(data.devicePixelRatio) || window.devicePixelRatio || 1;

        const wmSrc = withBasePath(dpr >= 2 ? "/watermark2x.png" : "/watermark.png");
        const wm = await loadImage(wmSrc);

        const ctx = previewRef.current.getContext("2d");
        if (ctx) {
          ctx.save();
          ctx.imageSmoothingEnabled = true;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.drawImage(wm, 0, 0, cssW, cssH);
          ctx.restore();
        }
      } catch (e) {
        console.warn("Preview watermark skipped:", e);
      }
    })();
  }, [saveData]);

  const handleDownload = async () => {
    if (!saveData) return;

    const data = JSON.parse(saveData);
    const cssW = 640;
    const cssH = 640;

    const out = exportCanvasRef.current ?? document.createElement("canvas");
    renderSaveDataToCanvas(out, saveData, {
      width: cssW,
      height: cssH,
      background: "#ffffff",
    });

    try {
      const dpr = Number(data.devicePixelRatio) || window.devicePixelRatio || 1;
      const wmSrc = withBasePath(dpr >= 2 ? "/watermark2x.png" : "/watermark.png");
      const watermark = await loadImage(wmSrc);

      const octx = out.getContext("2d");
      if (octx) {
        octx.save();
        octx.globalAlpha = 1;
        octx.imageSmoothingEnabled = true;
        octx.setTransform(dpr, 0, 0, dpr, 0, 0);
        octx.drawImage(watermark, 0, 0, cssW, cssH);
        octx.restore();
      }
    } catch (e) {
      console.warn("Watermark not applied:", e);
    }

    const url = out.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `message-wall-${Date.now()}.png`;
    a.click();
  };

  return (
    <Stack gap={2} alignItems="center" sx={{ width: "100%", px: 3, pb: 3 }}>
      <Typography
        variant="subtitle1"
        textAlign="center"
        sx={{ mt: 1, fontFamily: "Copperplate, serif", letterSpacing: 2 }}
      >
        画面でメッセージをご確認ください。
        <br />
        Check out your message <br />
        on the screen!
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: 350,
          aspectRatio: "1/1",
          border: "1px solid #fff",
          p: 0,
        }}
      >
        <canvas
          ref={previewRef}
          style={{ maxWidth: "100%", height: "auto", display: "block" }}
        />
      </Box>

      <Stack direction="row" gap={2}>
        <Button
          size="large"
          onClick={handleDownload}
          sx={{
            border: "2px solid white",
            color: "white",
            backgroundColor: "transparent",
            borderRadius: 1.5,
            px: 6,
            "&:hover": {
              backgroundColor: "transparent",
              border: "2px solid white",
            },
          }}
        >
          <SaveAltIcon />
        </Button>
      </Stack>

      {/* hidden export canvas used for PNG generation */}
      <canvas ref={exportCanvasRef} style={{ display: "none" }} />
    </Stack>
  );
}
