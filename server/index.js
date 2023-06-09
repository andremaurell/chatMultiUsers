const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: '*'}})
const PORT = process.env.PORT

io.on('connection', socket => {
  console.log('Usuário conectado!', socket.id);

  socket.on('disconnect', reason => {
    if (socket.data.username) {
    console.log('Usuário desconectado!', socket.id)
    }
  })

  socket.on('set_username', username => {
    socket.data.username = username
  })

  socket.on('message', text => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username
    })
    console.log('aiai')
  })
}) 
server.listen(PORT, () => 
console.log(`is running on port ${PORT}`))
