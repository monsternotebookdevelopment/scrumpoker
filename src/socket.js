// src/socket.js
import { io } from 'socket.io-client';

// GEÇİCİ - LOKALDE TEST İÇİN DOĞRUDAN BAĞLANTI
// Vite proxy'sini atlayıp direkt backend'e bağlanmayı deniyoruz.
const URL = 'http://localhost:3000';

const socket = io(URL, {
  // path: "/socket.io/", // Doğrudan URL verdiğimizde path'i genellikle belirtmeye gerek kalmaz, server standard path'i dinler.
  autoConnect: false,
  transports: ['websocket', 'polling'] 
});

export default socket;