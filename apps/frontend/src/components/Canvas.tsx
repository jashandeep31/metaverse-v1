import { useEffect, useRef } from "react";

const Canvas = () => {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("below render");

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#00000";
    for (let i = 0; i < canvas.width; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 10) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    // CREATE A USER squsare
    ctx.fillStyle = "#00000";
    ctx.fillRect(0, 10, 10, 10);
  }, []);
  // TODO: add code to keystroke event
  return (
    <div className="min-h-screen flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="border shadow"
      ></canvas>
    </div>
  );
};

export default Canvas;