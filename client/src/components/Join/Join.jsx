import React, {useRef} from 'react'
import io from 'socket.io-client'
import style from './Join.module.css'
import {Input, Button} from '@mui/material'
import imageLogo from '../../assets/et_chat.jpg'

export default function Join({setChatVisibility, setSocket}) {

  const usernameRef = useRef()

  const handleSubmit = async () => {
    const username = usernameRef.current.value
    if(!username.trim()) return
    const socket = await io.connect('http://192.168.43.58:3001')
    socket.emit('set_username', username)
    setSocket(socket)
    setChatVisibility(true)
  }

  return (
    <div>
    <div className={style['fotoAuthor']}>
    <img src={imageLogo} alt="André Maurell"/>
    <h2>Creator: André Maurell</h2>
  </div>
    <div className={style['join-container']}>
      <h2 className={style['title']}>Chat em tempo real</h2>
      <Input inputRef={usernameRef} placeholder='Nome de usuário' />
      <Button sx={{mt:2}} onClick={()=>handleSubmit()} variant="contained">Entrar</Button>
    </div>
    </div>
  )
}
