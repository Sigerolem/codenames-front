import { useEffect, useState } from 'preact/hooks'
import './app.css'
import { io } from 'socket.io-client'
import { ConnectComponent } from './components/ConnectComponent'
import { SetupGameComponent } from './components/SetupGameComponent'

const SOCKET_URL = import.meta.env.DEV
  ? 'http://localhost:3000'
  : 'wss://zutkwma9xk.execute-api.sa-east-1.amazonaws.com/production/'

const socket = io(SOCKET_URL, {
  autoConnect: false
})

type Player = {
  nick: string,
  room: string,
  role: string,
  team: 'blue' | 'red' | ''
}

export type RoomData = {
  language: 'pt-br' | 'en-us',
  words: string[],
  redWords: string[],
  blueWords: string[],
  blackWord: string,
  players: Player[],
  gameHost: string
}

export function App() {
  const [socketId, setSocketId] = useState('')
  const [nickname, setNickname] = useState('')
  const [isSetupPhase, setIsSetupPhase] = useState(false)
  const [roomData, setRoomData] = useState({} as RoomData)

  console.log(import.meta.env)

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id ?? '')
    })

    socket.on('firstPlayerConnected', (roomData: RoomData) => {
      setRoomData(roomData)
      setIsSetupPhase(true)
    })

    socket.on('newPlayerConnected', (roomData: RoomData) => {
      setRoomData(roomData)
      setIsSetupPhase(true)
    })

    socket.on('updateRoomData', (roomData: RoomData) => {
      setRoomData(roomData)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  function connectToSocket({ room, nickname }: { room: string, nickname: string }) {
    setNickname(nickname)
    socket.connect()
    socket.emit('join-room', { room, nick: nickname })
  }

  function onRoleSelect(team: 'red' | 'blue', role: 'spy' | 'field') {
    socket.emit('role-select', team, role)
  }

  return (
    <>
      {
        socketId === '' ?
          <ConnectComponent connectToSocket={connectToSocket} />
          :
          isSetupPhase ?
            <SetupGameComponent onRoleSelect={onRoleSelect} isHost={nickname === roomData.gameHost} roomData={roomData} /> :
            <div>game</div>
      }
    </>
  )
}
