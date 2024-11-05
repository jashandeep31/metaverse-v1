import WebSocket, { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const wss = new WebSocketServer({
  port: PORT,
});
// Now what we need to handle
// 1. User connects to / endpoint with the id of the user
// 2. User moves on the location

//  Task to handle write now
// handle when user connects the server

// authenticate the user is pending

const users: {
  id: string;
  x: number;
  y: number;
}[] = [];

function emit(ws: WebSocket, type: string, data: Record<string, any>) {
  ws.send(JSON.stringify({ type, data }));
}

const appendNewUser = () => {
  const user = { id: "1", x: 0, y: 0 };
  users.push(user);
  return user;
};

wss.on("connection", function connection(ws) {
  emit(ws, "user_position", appendNewUser());

  ws.on("message", (message: any) => {
    try {
      const data = JSON.parse(message);
      if (!data["type"]) {
        emit(ws, "error", { message: "type is missing" });
      }
      switch (data["type"]) {
        case "move":
          const user = users.find((user) => user.id === data["id"]);
          if (!user) {
            emit(ws, "error", { message: "user not found" });
            return;
          }
          const updatedXChange = user.x - data["x"];
          const updatedYChange = user.y - data["y"];
          console.log(updatedXChange, updatedYChange);
          if (updatedXChange > 1 || updatedYChange > 1) {
            emit(ws, "user_position", user);
            return emit(ws, "error", {
              message: "user can't move more than 1",
            });
          }
          user.x = data["x"];
          user.y = data["y"];
          emit(ws, "user_position", user);
          break;

        default:
          emit(ws, "error", { message: "type is not valid" });
          break;
      }
    } catch (error) {
      console.log(error);
      console.log(`server got fired up`);
    }
  });
});
