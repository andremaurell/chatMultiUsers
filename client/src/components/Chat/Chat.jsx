import React, {useRef, useState, useEffect} from 'react'
import {Input} from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import style from './Chat.module.css'
import imageLogo from '../../assets/et_chat.jpg'

export default function Chat({socket}) {

  const bottomRef = useRef()
  const messageRef = useRef()
  const [messageList, setMessageList] = useState([])
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);

  useEffect(()=>{
    socket.on('receive_message', data => {
      setMessageList((current) => [...current, data])
    })
    if(recordedAudio){
    socket.on('receive_message', data => {
      setMessageList((current) => [...current, data])
      console.log("oi")
    })
  }

    return () => socket.off('receive_message')
  }, [socket])

  useEffect(()=>{
    scrollDown()
  }, [messageList])

  const handleSubmit = () => {
    if (isRecording) {
      if (recordedAudio){
        socket.emit ('audio', recordedAudio.blob);
        setMessageList([...messageList, newMessage]);
        setRecordedAudio(null);
    }
    setRecordedAudio(false);
  } else {
  const message = messageRef.current.value
    if(!message.trim()) return
    socket.emit('message', message)
    clearInput()
    focusInput()
  }
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

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleSendAudio = () => {
    // Manipule o arquivo de áudio gravado aqui
  }

  return (
    <div>
      <div className={style['chat-container']}>
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
          {isRecording ? (
        <StopIcon sx={{ m: 1, cursor: 'pointer' }} onClick={stopRecording} color="primary" />
      ) : (
        <MicIcon sx={{ m: 1, cursor: 'pointer' }} onClick={startRecording} color="primary" />
      )}

      <SendIcon sx={{ m: 1, cursor: 'pointer' }} onClick={handleSubmit} color="primary" />
        </div>
      </div>
      </div>
  )
}
