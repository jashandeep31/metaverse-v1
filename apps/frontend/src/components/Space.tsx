import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Canvas from "./Canvas";

const Space = () => {
  const [currentPostion, setCurrentPostion] = useState({ x: 0, y: 0 });
  const [userId, setUserId] = useState<null | string>(null);
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const peerConnection = useMemo(() => {
    return new RTCPeerConnection();
  }, []);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const [users, setUsers] = useState<
    {
      id: string;
      x: number;
      y: number;
    }[]
  >([]);

  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      stream.getAudioTracks().forEach((track) => {
        // peerConnection.addTrack(track, stream);
        peerConnection.addTrack(track, stream);
      });
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`icen `, event.candidate);
          socket?.send(
            JSON.stringify({
              type: "candidate",
              id: userId,
              candidate: event.candidate,
            })
          );
        }
      };
    })();

    // setting up the stream of the ref
    if (!peerConnection) return;
    peerConnection.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };
  }, [peerConnection, socket, userId]);
  const handleAnswer = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ data }: any) => {
      if (!peerConnection) return;
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    },
    [peerConnection]
  );

  const handleOffer = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ data }: any, socket: WebSocket) => {
      if (!peerConnection || !socket) return;
      peerConnection.setRemoteDescription(data.offer);
      const answer = await peerConnection.createAnswer();
      peerConnection.setLocalDescription(answer);
      socket.send(JSON.stringify({ type: "answer", answer }));
    },
    [peerConnection]
  );
  const handleCall = useCallback(async () => {
    if (!peerConnection) return;
    const offer = await peerConnection.createOffer();
    peerConnection.setLocalDescription(offer);
    socket?.send(
      JSON.stringify({
        type: "offer",
        id: userId,
        offer: offer,
      })
    );
  }, [peerConnection, socket, userId]);
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
          setUserId(eventData.data.id);
          setCurrentPostion({
            x: eventData.data.x,
            y: eventData.data.y,
          });
          break;

        case "users":
          setUsers(eventData.data);

          break;
        case "update_user":
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
        case "candidate": {
          if (peerConnection) {
            (async () => {
              await peerConnection.addIceCandidate(
                new RTCIceCandidate(eventData.data.candidate)
              );
            })();
          }
          break;
        }
        case "offer": {
          console.log(`off is their`);
          handleOffer({ data: eventData.data }, socket);
          break;
        }
        case "answer": {
          console.log(`answer is their`);
          handleAnswer({ data: eventData.data });
          break;
        }
        default:
          console.log(eventData.type, eventData.data.message);
          break;
      }
    });

    return () => socket.close(); // Clean up the socket connection on unmount
  }, [handleOffer, handleAnswer, peerConnection]);

  const sendMovement = useCallback(
    (socket: WebSocket, x: number, y: number) => {
      setCurrentPostion((prevPosition) => {
        const newX = prevPosition.x + x;
        const newY = prevPosition.y + y;
        const isAlreadyUser = users.find((user) => {
          return user.x === newX && user.y === newY;
        });

        if (isAlreadyUser) {
          console.log("User already exists at this position");
          return prevPosition;
        }

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
        // checking user is nearby
        const nearUser = users.find((user) => {
          const distance = Math.sqrt(
            (user.x - newX) ** 2 + (user.y - newY) ** 2
          );
          if (distance === 1 && user.id !== userId) return user;
        });

        if (nearUser) {
          handleCall();
        }
        // code to creat a call
        return { x: newX, y: newY };
      });
    },
    [userId, users, handleCall]
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
        <button
          onClick={async () => {
            if (!peerConnection) return;
            const offer = await peerConnection.createOffer();
            peerConnection.setLocalDescription(offer);
            socket?.send(
              JSON.stringify({
                type: "offer",
                id: userId,
                offer: offer,
              })
            );
          }}
        >
          Offer call
        </button>
        <audio ref={remoteAudioRef} autoPlay />
      </div>

      {userId && (
        <Canvas userId={userId} users={users} currentPostion={currentPostion} />
      )}
    </div>
  );
};

export default Space;
