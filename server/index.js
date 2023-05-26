const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;


if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Crie um worker para cada CPU disponível
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Creating a new worker.`);
    cluster.fork();
  });

  // Escute eventos de fork de novos workers
  cluster.on('fork', (worker) => {
    console.log(`Worker ${worker.process.pid} was forked`);
  });


} else {

const app = require('express')()
const server = http.createServer(app)
const io = require('socket.io')(server, {cors: {origin: 'http://192.168.1.12'}})


//const redisAdapter = require('socket.io-redis');

// const redisURL = 'redis://sua-url-redis-aqui';
// const adapter = redisAdapter(redisURL);
// io.adapter(adapter);

const PORT = 3001

io.on('connection', socket => {
  console.log('Usuário conectado!', socket.id);

  socket.on('disconnect', reason => {
    console.log('Usuário desconectado!', socket.id)
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
  socket.on('audio', audio => {
    io.emit('receive_message', {
      audio,
      authorId: socket.id,
      author: socket.data.username
    })
    console.log('oi')
  })
})

server.listen(PORT, () => 
console.log(`Worker ${process.pid} is running on port ${PORT}`))
}