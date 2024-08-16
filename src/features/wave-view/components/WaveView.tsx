import { AutoResizedCanvas } from "@/components/AutoResizedCanvas";
import { useAudio } from "@/hooks";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";

export function WaveView(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const audio = useAudio();

  const draw = useCallback(
    (canvas: HTMLCanvasElement) => {
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      // // Clear canvas.
      context.clearRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;

      // Draw zero-line.
      context.strokeStyle = "lightgrey";

      context.beginPath();
      context.moveTo(0, centerY);
      context.lineTo(canvas.width, centerY);
      context.stroke();

      // Draw samples.
      if (!audio) {
        return;
      }

      const samples = audio.getChannelData(0);

      const WIDTH_PIXEL_RATE = 1000;
      const MAX_HEIGHT_PIXEL = 400;

      const maxDrawableHeight = Math.min(canvas.height, MAX_HEIGHT_PIXEL);

      context.strokeStyle = "red";

      context.beginPath();
      context.moveTo(0, centerY - samples[0] * maxDrawableHeight);

      if (WIDTH_PIXEL_RATE < audio.sampleRate) {
        // Selection drawing.
        for (let x = 0; x < canvas.width; x++) {
          context.lineTo(
            x,
            centerY -
              maxDrawableHeight *
                samples[Math.round((audio.sampleRate * x) / WIDTH_PIXEL_RATE)]
          );
        }
      } else {
        // Draw all samples.
        const maxDrawableSampleCount = Math.min(
          audio.length,
          Math.ceil((audio.sampleRate * canvas.width) / WIDTH_PIXEL_RATE) + 1
        );
        for (let i = 0; i < maxDrawableSampleCount; i++) {
          context.lineTo(
            (WIDTH_PIXEL_RATE * i) / audio.sampleRate,
            centerY - maxDrawableHeight * samples[i]
          );
        }
      }

      context.stroke();
    },
    [audio]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      draw(canvas);
    }
  }, [draw, audio]);

  return <AutoResizedCanvas ref={canvasRef} onResize={draw} />;
}
