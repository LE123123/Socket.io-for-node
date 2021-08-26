// @ts-check

const app = require('express')()
// Express를 사용하여 Http 서버를 생성한다
const server = require('http').createServer(app)
// 그리고 생성된 Http서버를 socket.io server로 uprgarde한다.
// @ts-ignore
const io = require('socket.io')(server)
const path = require('path')

const { log } = console

// root url에 대한 라우트를 정의한다. localhost:3000으로 접속하면 클라이언트에
// index.html을 전송한다.
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'))
})

// 클라이언트가 socket.io 서버에 접속했을 때 connection 이벤트가 발생한다.
// connection event handler를 정의한다

// io 객체는 연결된 전체 클라이언트와의 interacting을 위한 객체이고
// socke 객체는 개별 클라이언트와의 interacting을 위한 기본적인 객체이다.
io.on('connection', (socket) => {
  // 접속한 클라이언트의 정보가 수신된다면
  socket.on('login', (data) => {
    log(`Client logged-in\n name: ${data.name} + \n userid: ${data.userid}`)

    // socket에 클라이언트의 정보를 저장한다.
    /* eslint-disable no-param-reassign */
    socket.name = data.name
    socket.userid = data.userid

    // 접속된 모든 클라이언트에게 메세지를 전송한다.
    io.emit('login', data.name)
  })

  // 클라이언트로부터의 메세지가 수신되면
  socket.on('chat', (data) => {
    log(`Message from ${socket.name}: ${data.msg}`)

    const msg = {
      from: {
        name: socket.name,
        userid: socket.userid,
      },
      msg: data.msg,
    }

    // 메세지를 전송한 클라이언트를 제외한 모든 클라이언트들에게 메세지를 전송한다.
    socket.broadcast.emit('chat', msg)
  })

  socket.on('forceDisconnect', () => {
    socket.disconnect()
  })

  socket.on('disconnect', () => {
    log(`user disconnected: ${socket.name}`)
  })
})

server.listen(3000, () => {
  log(`Socket IO server listening on port 3000`)
})
