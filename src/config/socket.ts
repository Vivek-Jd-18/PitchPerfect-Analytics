import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initSocketServer = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Allow clients to join specific match rooms to receive targeted updates
    socket.on('joinMatch', (matchId: string) => {
      socket.join(`match_${matchId}`);
      console.log(`Socket ${socket.id} joined room match_${matchId}`);
    });

    socket.on('leaveMatch', (matchId: string) => {
      socket.leave(`match_${matchId}`);
      console.log(`Socket ${socket.id} left room match_${matchId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const broadcastLiveScore = (matchId: string, newStats: any) => {
  if (!io) {
    console.warn('Socket.io is not initialized');
    return;
  }
  // Broadcasts event 'live_score_update' specifically to clients in the match room
  io.to(`match_${matchId}`).emit('live_score_update', newStats);
};
