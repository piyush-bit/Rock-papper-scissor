import { useEffect, useState } from "react"

function Home({ socket ,SetInRoom , setRoom }: { socket: any , SetInRoom : any , setRoom :any}) {
    const createRoomClickhandler = async () => {
        socket.emit("create-room", { rounds })
    }

    const joinRoomClickhandler = async () => {
        socket.emit("join-room", { roomId: roomId })
    }

    useEffect(() => {
        socket?.on("room-created", ({ roomId , playerNo , player1name,player2name ,rounds  } : { roomId: string; playerNo: number; player1name?: {id: string, name: string} , player2name?: {id: string, name: string} , rounds: number }) => {
            setRoom({roomId,playerNo,player1name,player2name,rounds,wins : new Array<number>(rounds).fill(0)})
            SetInRoom(true)
        })
        socket?.on("room-joined", ({ roomId , playerNo , player1name,player2name, rounds  } : { roomId: string; playerNo: number;player1name?: {id: string, name: string} , player2name?: {id: string, name: string} , rounds: number }) => {
            setRoom({roomId,playerNo,player1name,player2name,rounds,wins : new Array<number>(rounds).fill(0)})
            SetInRoom(true)
        })
    })
    const [roomId, setRoomId] = useState('');
    const [rounds, setRounds] = useState(3);
    return (
        <div className="flex flex-col w-screen h-screen">
            <div className='flex flex-grow-[1]'>
                <p className='text-6xl m-auto'>
                    Rock-Paper-Scissor
                </p>
            </div>
            <div className='flex flex-grow-[4] '>
                <div className='flex flex-col  items-center gap-2 m-auto'>
                    <input type="text" name="" id="" className='outline rounded-md text-xl w-72 px-2' value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder='Room ID' />
                    <button className='outline outline-gray-800 w-fit py-[2px] px-6 text-xl cursor-pointer' onClick={joinRoomClickhandler} >Join</button>
                    <div className='outline outline-gray-800 w-fit py-[2px] px-6 text-xl my-6 cursor-pointer hover:bg-gray-200' onClick={createRoomClickhandler} >Create Room</div>
                    <div className="flex gap-2 justify-between">
                        <div className={`outline px-4 py-3 rounded-md cursor-pointer ${rounds == 3 ? "bg-gray-200" : ""} `} onClick={() => setRounds(3)}>3</div>
                        <div className={`outline px-4 py-3 rounded-md cursor-pointer ${rounds == 5 ? "bg-gray-200" : ""} `} onClick={() => setRounds(5)}>5</div>
                        <div className={`outline px-4 py-3 rounded-md cursor-pointer ${rounds == 10 ? "bg-gray-200" : ""} `} onClick={() => setRounds(10)}>10</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home