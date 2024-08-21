import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import config from './config';


const SOCKET_SERVER_URL = `${config.apiBaseUrl}`;

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_SERVER_URL);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
