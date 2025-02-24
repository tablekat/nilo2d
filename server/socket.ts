import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocket = (res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle player joining
      socket.on('player:join', (playerData) => {
        socket.broadcast.emit('player:joined', { id: socket.id, ...playerData });
        // Send current players to the new player
        socket.emit('players:current', getConnectedPlayers(io));
      });

      // Handle player movement
      socket.on('player:move', (position) => {
        socket.broadcast.emit('player:moved', { id: socket.id, position });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        io.emit('player:left', socket.id);
      });
    });
  }
  return res.socket.server.io;
};

// Helper function to get all connected players
function getConnectedPlayers(io: SocketIOServer) {
  const connectedSockets = Array.from(io.sockets.sockets.values());
  return connectedSockets.map(socket => ({
    id: socket.id,
    position: socket.data.position || { x: 0, y: 0 }
  }));
} 