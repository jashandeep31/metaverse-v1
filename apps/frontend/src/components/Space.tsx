import { useCallback, useEffect, useState } from "react";
import Canvas from "./Canvas";

const Space = () => {
  const [currentPostion, setCurrentPostion] = useState({ x: 0, y: 0 });
  const [userId, setUserId] = useState<null | string>(null);
  const [socket, setSocket] = useState<null | WebSocket>(null);
console.log("inside space");

  const [users, setUsers] = useState<
    {
      id: string;
      x: number;
      y: number;
    }[]
  >([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");
    setSocket(socket);
    
    socket.addEventListener("open", () => {
      // handling the even from the server
    });

    socket.addEventListener("message", (event) => {
      const eventData = JSON.parse(event.data);

      switch (eventData.type) {
        case "user_position":
          setUserId(eventData.data.id);
          setCurrentPostion({
            x: eventData.data.x,
            y: eventData.data.y,
          });
          break;

        case "users":
          setUsers(eventData.data);
          console.log(users);
          
          break;
        case "update_user":
          console.log(`here we are`);
          setUsers((prevUsers) => {
            console.log(prevUsers);
            const userIndex = prevUsers.findIndex(
              (user) => user.id === eventData.data.id
            );
            if (userIndex === -1) return prevUsers;
            prevUsers[userIndex].x = eventData.data.x;
            prevUsers[userIndex].y = eventData.data.y;
            return [...prevUsers];
          });
          break;
        case "test_message":
          console.log(eventData.type, eventData.data.message);
          break;
        default:
          console.log(eventData.type, eventData.data.message);
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
            id: userId,
            x: newX,
            y: newY,
          })
        );

        return { x: newX, y: newY };
      });
    },
    [userId]
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
        <p>Id:{userId?.slice(0, 3)}</p>
        <p>Total: {users.length}</p>
        <p>X: {currentPostion.x}</p>
        <p>Y: {currentPostion.y}</p>
      </div>
      <Canvas users={users} currentPostion={currentPostion} />
    </div>
  );
};

export default Space;
