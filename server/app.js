import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors:"http://localhost:5173/"
});

io.on("connection", (socket) => {
 console.log(socket.id,'new player joined');
});

httpServer.listen(3000,()=>{
    console.log('server connected');
}); 