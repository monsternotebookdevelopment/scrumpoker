// monster-poker/src/socket.js
import { io } from 'socket.io-client';

// Tarayıcı, Socket.IO bağlantısını frontend'in sunulduğu aynı host ve porta,
// /socket.io/ yolu üzerinden yapacak. Nginx bu isteği backend'e proxy'leyecek.
// Bu şekilde, spesifik bir URL (http://monster-poker-api:3000 veya http://localhost:3001)
// belirtmemize gerek kalmıyor. Tarayıcı kendi bulunduğu adresi baz alacak.
const socket = io({
  path: "/socket.io/", // Nginx'in proxy'leyeceği yol
  autoConnect: false,
  transports: ['websocket', 'polling'] 
});

console.log('Socket.IO client initialized to connect to current host via path "/socket.io/"');

export default socket;