import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: /http:\/\/localhost:\d+/,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const port = 4000;

// Define an interface for rooms
interface Room {
    id: string,
    rounds: number;
    players: Set<string>;
    player1name?: {id: string, name: string};
    player2name?: {id: string, name: string};
    choices: Map<string, string>;
    currentRound: number;
    roundTimer: NodeJS.Timeout | null;
    gameStarted: boolean;
    wins: number[]
}

const rooms = new Map<string, Room>();

io.on("connection", (socket: any) => {
    console.log("a user connected");
    socket.on("create-room", ({ rounds }: { rounds: number }) => {
        let roomId;
        do {
            roomId = Math.random().toString(36).substring(2, 15);
        } while (rooms.has(roomId));
        rooms.set(roomId, {
            id: roomId,
            rounds,
            player1name: {id: socket.id, name: 'Player 1'},
            players: new Set([socket.id]),
            choices: new Map(),
            currentRound: 1,
            roundTimer: null,
            gameStarted: false,
            wins: new Array<number>(rounds).fill(0)
        });
        socket.join(roomId);
        socket.emit("room-created", { roomId , playerNo : 1,player1name: {id: socket.id, name: 'Player 1'}, rounds  });
    });

    socket.on("join-room", (roomId: string) => {
        if (rooms.has(roomId)) {
            //check if room is full
            if (rooms.get(roomId)!.players.size < 2) {
                //join room
                socket.join(roomId);
                rooms.get(roomId)!.players.add(socket.id);
                socket.emit("room-joined", { roomId, playerNo: 2 , rounds: rooms.get(roomId)!.rounds });
            }
            else {
                //emit room is full
                socket.emit("room-full");
            }
        } else {
            //emit room doesnt exist
            socket.emit("room-doesnt-exist");
        }
    });

    socket.on("start-game", (roomId: string) => {
        const room = rooms.get(roomId)!;
        //check if the user is in the room
        if (!room.players.has(socket.id)) {
            socket.emit("user-not-in-room");
        }

        if (room.players.size >= 2 && !room.gameStarted) {
            room.gameStarted = true;

            io.to(roomId).emit("game-started");

            startRound(roomId, room);
        }
    });

    socket.on("player-choice", ({ roomId, choice }: { roomId: string; choice: string }) => {
        const room = rooms.get(roomId)!;
    
        room.choices.set(socket.id, choice);
    
        if (room.choices.size === room.players.size) {
          clearTimeout(room.roundTimer!);
    
          const result = determineWinner(room);
          io.to(roomId).emit("game-result", result);
    
          if (room.currentRound < room.rounds) {
            room.currentRound++;
            room.choices.clear();
            startRound(roomId, room);
          } else {
            io.to(roomId).emit("game-over");
            rooms.delete(roomId);
          }
        }
      });

      //update player name
    socket.on("update-player-name", ({ roomId, name }: { roomId: string; name: string }) => {
        const room = rooms.get(roomId)!;
        if (room.player1name?.id === socket.id) {
            room.player1name = { id: socket.id, name };
            io.to(roomId).emit("player-1-name-updated", name);
        } else if (room.player2name?.id === socket.id) {
            room.player2name = { id: socket.id, name };
            io.to(roomId).emit("player-2-name-updated", name);
        }
        else
        {
            socket.emit("user-not-in-room");
        }
    })


    //impleament startRoom
    function startRound(roomId: string, room: Room) {
        io.to(roomId).emit("round-started", room.currentRound);
        room.roundTimer = setTimeout(() => {

            const win =determineWinner(room)
            room.wins[room.currentRound-1] = win

            io.to(roomId).emit("round-ended", {round:room.currentRound,win});

            if (room.currentRound < room.rounds) {
                room.currentRound++; 
                room.choices.clear();
                startRound(roomId, room);
              } else {
                io.to(roomId).emit("game-over");
                rooms.delete(roomId);
              }
        }, 10000);
    }

    function determineWinner(room : Room) {
        const choices = room.choices;
        const choice1 = choices.get(room.player1name!.id);
        const choice2 = choices.get(room.player2name!.id)!;

        if(!choice1){
            return 2;
        }
        if(!choice2){
            return 1;
        }
    
        if (choice1 === choice2) {
          return 0;
        } else if (
          (choice1 === "rock" && choice2 === "scissors") ||
          (choice1 === "paper" && choice2 === "rock") ||
          (choice1 === "scissors" && choice2 === "paper")
        ) {
          return 1;
        } else {
          return 2;
        }
    }


    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        
        rooms.forEach((room) => {
            if (room.players.has(socket.id)) {
                room.players.delete(socket.id);
            }
        });
        //if room empty delete it
        rooms.forEach((room) => {
            if (room.players.size === 0) {
                rooms.delete(room.id);
            }
        })
    })
})


app.get("/", (req: any, res: any) => {
    res.send("Hello World!");
});

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});