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

    return () => socket.close(); // Clean up the socket connection on unmount
  }, []);

  const sendMovement = useCallback(
    (socket: WebSocket, x: number, y: number) => {
      setCurrentPostion((prevPosition) => {
        const newX = prevPosition.x + x;
        const newY = prevPosition.y + y;
        if (newX < 0 || newY < 0 || newX > 9 || newY > 9) return prevPosition;

        // Send the updated position to the server
        socket.send(
          JSON.stringify({
            type: "move",
            id: "1",
            x: newX,
            y: newY,
          })
        );

        return { x: newX, y: newY };
      });
    },
    []
  );

  useEffect(() => {
    if (!socket) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        sendMovement(socket, 1, 0);
      } else if (e.key === "ArrowLeft") {
        sendMovement(socket, -1, 0);
      } else if (e.key === "ArrowDown") {
        sendMovement(socket, 0, 1);
      } else if (e.key === "ArrowUp") {
        sendMovement(socket, 0, -1);
      }
    };
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down); // Clean up event listener on unmount
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
