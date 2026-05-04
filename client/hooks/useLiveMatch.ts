'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';

// Assuming an action exists in a matchSlice or similar to handle incoming stats.
// In this boilerplate we'll define a generic type and demonstrate dispatch usage.
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useLiveMatch = (matchId: string) => {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const [liveStats, setLiveStats] = useState<any>(null); // Local state fallback

  useEffect(() => {
    if (!matchId) return;

    const socket: Socket = io(SOCKET_URL);

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('joinMatch', matchId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('live_score_update', (newStats: any) => {
      setLiveStats(newStats);
      
      // Dispatch to Redux store (e.g., updating a live MatchLog slice)
      // dispatch(updateLiveMatchStats(newStats));
    });

    return () => {
      socket.emit('leaveMatch', matchId);
      socket.disconnect();
    };
  }, [matchId, dispatch]);

  return { isConnected, liveStats };
};
