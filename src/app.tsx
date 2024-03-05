import { useEffect, useState } from 'preact/hooks'
import './app.css'
import { io } from 'socket.io-client'
import { ConnectComponent } from './components/ConnectComponent'
import { SetupGameComponent } from './components/SetupGameComponent'

const socket = io('http://localhost:3000', {
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
