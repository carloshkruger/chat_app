import { WebSocketServer } from 'ws';

const WEB_SOCKET_PORT = Number(process.env.WEB_SOCKET_PORT || 3000);

export const wsServer = new WebSocketServer({ port : WEB_SOCKET_PORT });