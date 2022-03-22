const http = require('http');
const server = http.createServer();
const { Server } = require("socket.io");
const io = new Server(server);
const TailingReadableStream = require('tailing-stream');
require('dotenv').config();

const stream = TailingReadableStream.createReadStream(process.env.LOG_FILE_PATH, {timeout: 0});

io.on('connection', (socket) => {
  console.log('Client connected for log monitoring');
});

stream.on('data', buffer => {
  io.emit('log', buffer.toString());
});

stream.on('close', () => {
  console.log("Stream closed");
});

server.listen(process.env.PORT, () => {
  console.log('Monitor listening for appends to ' + process.env.LOG_FILE_PATH)
  console.log('Monitor accepting clients on port ' + process.env.PORT);
});