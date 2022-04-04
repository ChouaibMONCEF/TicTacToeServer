import { Server, Socket } from "socket.io";
import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
  SocketRooms,
} from "socket-controllers";

@SocketController()
export class RoomController {
  @OnMessage("join_game")
  public async joinGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    console.log("New user joined room: ", message);

    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
    const socketRoom = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    if (
      SocketRooms.length > 0 ||
      (connectedSockets && connectedSockets.size === 2)
    ) {
      socket.emit("room_join_error", {
        error: "Room is full please choose another room to play!",
      });
    } else {
      await socket.join(message.roomId);
      socket.emit("room_joined");
    }
  }
}
 