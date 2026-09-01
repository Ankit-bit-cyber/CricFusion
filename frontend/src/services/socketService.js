import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

let socket = null;

export const connectSocket = (userId) => {
  socket = io(SOCKET_URL, { withCredentials: true });
  socket.on('connect', () => {
    socket.emit('join', userId);
  });
  socket.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message);
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const joinMatchRoom = (matchId) => socket?.emit('joinMatch', matchId);
export const leaveMatchRoom = (matchId) => socket?.emit('leaveMatch', matchId);
export const sendMatchMessage = (data) => socket?.emit('matchMessage', data);
export const emitTyping = (matchId, userName) => socket?.emit('typing', { matchId, userName });