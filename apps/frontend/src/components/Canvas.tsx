import { useEffect, useRef } from "react";

const Canvas = ({
  currentPostion,
  users,
  userId,
}: {
  currentPostion: { x: number; y: number };
  userId: string;
  users: {
    id: string;
    x: number;
    y: number;
  }[];
}) => {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("below render");

    const ctx = canvas.getContext("2d");
    const ctx1 = canvas.getContext("2d");
    if (!ctx || !ctx1) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx1.clearRect(0, 0, canvas.width, canvas.height);

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
    ctx.fillStyle = "#000000";
    ctx.fillRect(currentPostion.x * 10, currentPostion.y * 10, 10, 10);
    users.map((user: { id: string; x: number; y: number }) => {
      if (user.id === userId) return;
      ctx.fillStyle = "blue";
      ctx.fillRect(user.x * 10, user.y * 10, 10, 10);
    });
  }, [currentPostion, users, userId]);

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
