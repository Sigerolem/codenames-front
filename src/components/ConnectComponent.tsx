import { useState } from "preact/hooks"

interface componentProps {
  connectToSocket: ({ room, nickname }: { room: string, nickname: string }) => void
}

export function ConnectComponent({ connectToSocket }: componentProps) {
  const [nickname, setNickname] = useState('')
  const [room, setRoom] = useState('')
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      connectToSocket({ room, nickname })
    }}>
      <label htmlFor="nick">Nickname</label>
      <input id='nick' type="nick" onInput={e => { setNickname(e.currentTarget.value) }} value={nickname} />
      <br />
      <label htmlFor="room">roomname</label>
      <input id='room' type="room" onInput={e => { setRoom(e.currentTarget.value) }} value={room} />
      <br />
      <button>connect</button>
    </form>
  )
}