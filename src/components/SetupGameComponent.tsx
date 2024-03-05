import { TargetedEvent } from "preact/compat"
import { useState } from "preact/hooks"
import { RoomData } from "../app"

interface componentProps {
  isHost: boolean,
  roomData: RoomData,
  onRoleSelect: (team: 'red' | 'blue', role: 'spy' | 'field') => void
}

export function SetupGameComponent({ isHost, roomData, onRoleSelect }: componentProps) {
  const [team, setTeam] = useState('')
  const [language, setLanguage] = useState('en-us')

  const { players } = roomData

  function onInput(e: TargetedEvent<HTMLSelectElement>) {
    setLanguage(e.currentTarget.value)
  }

  function onRoleClick(e: TargetedEvent<HTMLButtonElement>) {
    e.preventDefault()
    let team = 'blue' as 'blue' | 'red'
    if (e.currentTarget.value.includes('red')) {
      team = 'red'
    }

    if (e.currentTarget.value.includes('spy')) {
      onRoleSelect(team, 'spy')
    } else {
      onRoleSelect(team, 'field')
    }
  }

  return (
    <div>
      {isHost &&
        <>
          <label htmlFor="language">language</label>
          <select value={language} id="language" onInput={onInput}>
            <option value="pt-br">portuguese</option>
            <option value="en-us">english</option>
          </select>
        </>
      }
      <p>players:</p>
      <ul>
        {
          players?.map(player =>
            // player.role === ''
            // ?
            <li key={player.nick}>{player.nick}</li>
            // : 
            // <></>
          )}
      </ul>
      <button value='red spy' onClick={onRoleClick}>red spy</button>
      <ul>
        {players?.map(player => (
          player.team === 'red' && player.role === 'spy' &&
          <li key={player.nick}>{player.nick}</li>
        ))}
      </ul>
      <button value='blue spy' onClick={onRoleClick}>blue spy</button>
      <ul>
        {players?.map(player => (
          player.team === 'blue' && player.role === 'spy' &&
          <li key={player.nick}>{player.nick}</li>
        ))}
      </ul>
      <button value='red field' onClick={onRoleClick}>red field</button>
      <ul>
        {players?.map(player => (
          player.team === 'red' && player.role === 'field' &&
          <li key={player.nick}>{player.nick}</li>
        ))}
      </ul>
      <button value='blue field' onClick={onRoleClick}>blue field</button>
      <ul>
        {players?.map(player => (
          player.team === 'blue' && player.role === 'field' &&
          <li key={player.nick}>{player.nick}</li>
        ))}
      </ul>
      {
        isHost &&
        <button>start game</button>
      }
    </div>
  )
}