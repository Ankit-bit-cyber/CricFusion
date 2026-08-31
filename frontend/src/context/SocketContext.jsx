import { createContext, useEffect, useState } from 'react';
import { getSocket } from '../services/socketService';
import { useAuth } from '../hooks/useAuth';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('onlineUsers', (users) => setOnlineUsers(users));
    return () => socket.off('onlineUsers');
  }, [user]);

  return (
    <SocketContext.Provider value={{ onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};