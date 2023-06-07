import React, {useRef, useState, useEffect} from 'react'
import {Input} from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import style from './Chat.module.css'
import imageLogo from '../../assets/et_chat.jpg'
import fundoAmarelo from '../../assets/fundoChat_amarelo.png';
import fundoAzul from '../../assets/fundoChat_azul.png';
import fundoRosa from '../../assets/fundoChat_rosa.png';
import fundoNormal from '../../assets/fundoChat.png'

export default function Chat({socket}) {

  const bottomRef = useRef()
  const messageRef = useRef()
  const [messageList, setMessageList] = useState([])
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(()=>{
    socket.on('receive_message', data => {
      setMessageList((current) => [...current, data])
    })

    return () => socket.off('receive_message')
  }, [socket])

  useEffect(()=>{
    scrollDown()
  }, [messageList])

  const handleSubmit = async () => {
    const message = messageRef.current.value
    if(!message.trim()) return

    await socket.emit('message', message)
    clearInput()
    focusInput()
  }
  


  const clearInput = () => {
    messageRef.current.value = ''
  }

  const focusInput = () => {
    messageRef.current.focus()
  }

  const getEnterKey = (e) => {
    if(e.key === 'Enter')
      handleSubmit()
  }

  const scrollDown = () => {
    bottomRef.current.scrollIntoView({behavior: 'smooth'})
  }

  const handleBackground = (image) => {
    setBackgroundImage(`url(${image})`)
  }

  return (
    <div>
      <div className={style["select_background"]}>
        <h2>Selecione o tema de fundo do chat:</h2>     
        <div className={style["chat-background"]} >
       <button onClick={() => handleBackground(fundoNormal)}>Padrão</button>
       <button onClick={() => handleBackground(fundoAmarelo)}>Amarelo</button>
       <button onClick={() => handleBackground(fundoAzul)}>Azul</button>
       <button onClick={() => handleBackground(fundoRosa)}>Rosa</button>
       </div>
      </div>
      <div className={style['chat-container']} style={{ backgroundImage: backgroundImage }}>
        <div className={style['barLogo']}>
        <div className={style['fotoAuthor']}>
        <img src={imageLogo} alt="André Maurell"/>
        </div>
          <span></span>
        </div>
        <div className={style["chat-body"]}>

        {
          messageList.map((message,index) => (
            <div className={`${style["message-container"]} ${message.authorId === socket.id && style["message-mine"]}`} key={index}>
              <div className="message-author"><strong>{message.author}</strong></div>
              <div className="message-text">{message.text}</div>
            </div>
          ))
        }
        <div ref={bottomRef} />
        </div>
        <div className={style["chat-footer"]}>
          <Input inputRef={messageRef} placeholder='Mensagem' onKeyDown={(e)=>getEnterKey(e)} fullWidth />
          <SendIcon sx={{ m: 1, cursor: 'pointer' }} onClick={handleSubmit} color="primary" />
        </div>
      </div>
      </div>
  )
}
