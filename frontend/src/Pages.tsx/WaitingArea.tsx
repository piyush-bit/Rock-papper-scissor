import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"

function WaitingArea({room,socket}:{room : any,socket : Socket|null}) {

    useEffect(()=>{
        console.log(room)
    },[])

    const [playerName, setPlayerName] = useState(room.playerNo == 1 ? room.player1name?.name : room.player2name?.name)
    return (
        <div className="flex flex-col w-screen h-screen px-3 pb-6">
            <div className="text-4xl py-6 text-center">
                <div>Rock-Paper-Scissor</div>
                <div className="text-3xl py-2" onClick={() => { 
                    //copy room id to clipboard
                    navigator.clipboard.writeText(room.roomId)
                }}>RoomId : {room.roomId}</div>
            </div>
            <div className="grid grid-cols-2 grid-rows-1 flex-grow">
                <div className="flex flex-col items-start ">
                    <div className="flex-grow-[1]"></div>
                    <div className="pl-4">
                    <div className="avatar h-60 w-20 bg-red-200"></div>
                    <input className="outline rounded-md w-fit text-2xl px-16" type="text" name="" id="" value={room?.player1name?.name}/>
                    <div className="selecter flex gap-3 py-4">
                        <div className="outline rounded-md h-12 w-16 flex justify-center items-center cursor-pointer">5</div>
                        <div className="outline rounded-md h-12 w-16 flex justify-center items-center cursor-pointer">5</div>
                        <div className="outline rounded-md h-12 w-16 flex justify-center items-center cursor-pointer">5</div>
                        <div className="outline rounded-md h-12 w-16 flex justify-center items-center cursor-pointer">5</div>
                        <div className="outline rounded-md h-12 w-16 flex justify-center items-center cursor-pointer">5</div>
                    </div>
                    </div>
                    <div className="flex-grow-[2]"></div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex-grow-[1]"></div>
                    <div className="pl-4">
                    <div className="avatar h-60 w-20 bg-red-200"></div>
                    <input className="outline rounded-md w-fit text-2xl px-16" type="text" name="" id="" value={room?.player2name? room?.player2name?.name :"waiting"}/>
                    <div className="selecter flex gap-3 py-4">
                        <div className="outline rounded-md h-12 w-16 flex justify-center items-center cursor-pointer">5</div>
                        <div className="outline rounded-md h-12 w-16 flex justify-center items-center cursor-pointer">5</div>
                        <div className="outline rounded-md h-12 w-16 flex justify-center items-center cursor-pointer">5</div>
                        <div className="outline rounded-md h-12 w-16 flex justify-center items-center cursor-pointer">5</div>
                        <div className="outline rounded-md h-12 w-16 flex justify-center items-center cursor-pointer">5</div>
                    </div>
                    </div>
                    <div className="flex-grow-[2]"></div>
                </div>
            </div>
            <div className="flex justify-center ">
                <p className="outline rounded-md w-fit px-6 text-3xl px-auto cursor-pointer">Start</p>
            </div>
        </div>
    )
}

export default WaitingArea