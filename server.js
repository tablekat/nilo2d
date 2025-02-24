const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('player:join', (playerData) => {
      socket.broadcast.emit('player:joined', { id: socket.id, ...playerData });
      const players = Array.from(io.sockets.sockets.values()).map(s => ({
        id: s.id,
        position: s.data.position || { x: 0, y: 0 }
      }));
      socket.emit('players:current', players);
    });

    socket.on('player:move', (position) => {
      socket.broadcast.emit('player:moved', { id: socket.id, position });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      io.emit('player:left', socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}); 