import { createServer } from "http";
import { Server } from "socket.io";


 const corsOptions = {
  origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://tic-tac-toe-game-two-alpha.vercel.app"],
  Methods: [ "GET","POST","PUT","DELETE"],
  credentials: true
};

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: corsOptions
});


const allUsers = {};
const allRooms = [];

io.on("connection", (socket) => {
  console.log(socket.id, 'new player joined');

  allUsers[socket.id] = {
    socket: socket,
    online: true
  };

  socket.on("request_to_play", (data) => {
    const currentUser = allUsers[socket.id];
    currentUser.playerName = data.playerName;

    let opponentPlayer;

    for (const key in allUsers) {
      const user = allUsers[key];
      if (user.online && !user.playing && socket.id !== key) {
        opponentPlayer = user;
        break;
      };
    };

    if (opponentPlayer) {

      allRooms.push({
        player1: opponentPlayer,
        player2: currentUser
      })

      opponentPlayer.socket.emit("OpponentFound", {
        opponentName: currentUser.playerName,
        playingAs: "circle"
      });

      currentUser.socket.emit("OpponentFound", {
        opponentName: opponentPlayer.playerName,
        playingAs: "cross"
      });

      currentUser.socket.on("PlayerMoveFromClient", (data) => {
        opponentPlayer.socket.emit("PlayerMoveFromServer", {
          ...data
        })
      });

      opponentPlayer.socket.on("PlayerMoveFromClient", (data) => {
        currentUser.socket.emit("PlayerMoveFromServer", {
          ...data
        })
      });

    } else {
      currentUser.socket.emit("OpponentNotFound");
    };

  });

  socket.on("disconnect", () => {
    console.log("Player Left", socket.id);
    const currentUser = allUsers[socket.id];
    currentUser.online = false;
    currentUser.playing = false;

    for (let i = 0; i < allRooms.length; i++) {
      const { player1, player2 } = allRooms[i];

      if (player1.socket.id === socket.id) {
        player2.socket.emit("OpponentLeftMatch");
        break;
      };

      if (player2.socket.id === socket.id) {
        player1.socket.emit("OpponentLeftMatch");
        break;
      };

    };

  });
});

httpServer.listen(3000, () => {
  console.log('server connected');
}); 