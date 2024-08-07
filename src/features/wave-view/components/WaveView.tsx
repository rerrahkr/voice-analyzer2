import { type P5CanvasInstance, ReactP5Wrapper } from "@p5-wrapper/react";
import type React from "react";

function sketch(p5: P5CanvasInstance) {
  p5.setup = () => {
    p5.createCanvas(600, 400, p5.WEBGL);
  };

  p5.draw = () => {
    p5.background(128);
    p5.normalMaterial();
    p5.push();
    p5.rotateZ(p5.frameCount * 0.01);
    p5.rotateX(p5.frameCount * 0.01);
    p5.rotateY(p5.frameCount * 0.01);
    p5.plane(100);
    p5.pop();
  };
}

export function WaveView(): React.JSX.Element {
  return <ReactP5Wrapper sketch={sketch} />;
}
