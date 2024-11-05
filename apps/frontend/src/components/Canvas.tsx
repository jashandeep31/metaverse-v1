import { useEffect, useRef } from "react";

const Canvas = ({
  currentPostion,
}: {
  currentPostion: { x: number; y: number };
}) => {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("below render");

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "red";
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
    ctx.fillRect(currentPostion.x * 10, currentPostion.y * 10, 10, 10);
  }, [currentPostion]);

  return (
    <div className=" flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={100}
        height={100}
        className="border shadow"
      ></canvas>
    </div>
  );
};

export default Canvas;
