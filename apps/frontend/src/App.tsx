import { useCallback, useEffect, useState } from "react";
import Canvas from "./components/Canvas";

const App = () => {
  const [currentPostion, setCurrentPostion] = useState({ x: 0, y: 0 });
  const [socket, setSocket] = useState<null | WebSocket>(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8001");
    setSocket(socket);
    socket.addEventListener("open", () => {
      // handling the even from the server
    });
    socket.addEventListener("message", (event) => {
      const eventData = JSON.parse(event.data);
      switch (eventData.type) {
        case "user_position":
          console.log(`here web ha`);
          setCurrentPostion({
            x: eventData.data.x,
            y: eventData.data.y,
          });
          break;

        default:
          console.log(eventData.type);
          break;
      }
    });
  }, []);

  const sendMovement = useCallback(
    (socket: WebSocket, x: number, y: number) => {
      if (currentPostion.x + x < 0 || currentPostion.y + y < 0) return;
      if (currentPostion.x + x > 9 || currentPostion.y + y > 9) return;

      socket.send(
        JSON.stringify({
          type: "move",
          id: "1",
          x: currentPostion.x + x,
          y: currentPostion.y + y,
        })
      );
    },
    [currentPostion]
  );
  useEffect(() => {
    if (!socket) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        sendMovement(socket, 1, 0);
      }
      if (e.key === "ArrowLeft") {
        sendMovement(socket, -1, 0);
      }
      if (e.key === "ArrowDown") {
        sendMovement(socket, 0, 1);
      }
      if (e.key === "ArrowUp") {
        sendMovement(socket, 0, -1);
      }
    };
    document.addEventListener("keydown", down);
  }, [socket, sendMovement]);

  return (
    <div>
      <div>
        <p>X: {currentPostion.x}</p>
        <p>Y: {currentPostion.y}</p>
      </div>
      <Canvas currentPostion={currentPostion} />
    </div>
  );
};

export default App;
