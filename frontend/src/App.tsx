import { useEffect, useState } from 'react';
import Home from './Pages.tsx/Home'
import WaitingArea from './Pages.tsx/WaitingArea'
import { Socket, io } from 'socket.io-client'

interface Room{
  id: string,
  playerNo : number,
  rounds: number;
  player1name?: {id: string, name: string};
  player2name?: {id: string, name: string};
  currentRound: number;
  wins: number[]
}


function App() {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [inRoom , setInRoom] = useState(false)
  const [room ,setRoom] = useState<Room>()
  useEffect(() => {
    const socketInstance = io('http://localhost:4000');
    setSocket(socketInstance);

    // listen for events emitted by the server

    socketInstance.on('connect', () => {
      console.log('Connected to server');
    });

    socketInstance.on('message', (data) => {
      console.log(`Received message: ${data}`);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);
  if(inRoom){
      return <WaitingArea room={room} socket={socket}/>
  }
  else
  return (
    <Home socket={socket} SetInRoom={setInRoom} setRoom={setRoom} />
  )
}

export default App
