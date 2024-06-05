import WebSocket from 'ws';

export function sendWsMessage(ws, message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  }
}
