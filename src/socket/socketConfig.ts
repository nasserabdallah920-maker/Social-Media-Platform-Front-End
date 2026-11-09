import { io, Socket } from 'socket.io-client';
import cookie from 'universal-cookie';

const useCookie = new cookie();

export const socket: Socket = io(`${process.env.NEXT_PUBLIC_API_SOCKET_URL}`, {
  auth: { token: useCookie.get('access_token') },
  autoConnect: true,
});

export const updateSocketToken = (token?: string) => {
  const currentToken = token || useCookie.get('access_token');
  if (socket.auth) {
    socket.auth = { token: currentToken };
  }
  if (!socket.connected) {
    socket.connect();
  }
};

export default socket;