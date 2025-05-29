// src/stores/pokerStore.js

import { defineStore } from 'pinia'
import socket from '@/socket'; // Socket bağlantımızı import ediyoruz

export const usePokerStore = defineStore('poker', {
  state: () => ({
    roomId: null,
    nickname: localStorage.getItem('nickname') || 'Misafir', // Global nickname (HomeView'dan set ediliyor)
    socketId: null,       // Mevcut client'in socket ID'si
    participants: [],     // Odadaki katılımcıların listesi
    selectedCard: null,   // Mevcut client'in seçtiği kart
    votesRevealed: false, // Oylar gösteriliyor mu?
    roomAdminId: null,    // Odanın admin kullanıcısının socket ID'si
    fibonacciDeck: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55], // Kart destesi
  }),

  getters: {
    averageVote: (state) => {
      const validVotes = state.participants
        .map(p => p.vote)
        .filter(vote => typeof vote === 'number');
      if (validVotes.length === 0) {
        return 'N/A';
      }
      const sum = validVotes.reduce((acc, vote) => acc + vote, 0);
      return (sum / validVotes.length).toFixed(1);
    },
    votedCount: (state) => {
      return state.participants.filter(p => p.vote !== null).length;
    },
    isCurrentUserAdmin: (state) => { 
      return state.socketId && state.roomAdminId && state.socketId === state.roomAdminId;
    }
  },

  actions: {
    connect(roomId) {
      this.roomId = roomId;
      // Logları bir önceki mesajımdaki gibi ekleyebilirsiniz, hata ayıklama için faydalı olur.
      console.log('[STORE] connect action called for room:', roomId); 

      socket.connect(); // Socket bağlantısını aktif et
      
      socket.on('connect', () => {
        this.socketId = socket.id;
        console.log('[STORE] Socket connected. My ID (socketId):', this.socketId);
        
        console.log('[STORE] Emitting joinRoom for room:', this.roomId, 'with nickname:', this.nickname, 'and socketId:', this.socketId);
        socket.emit('joinRoom', { roomId: this.roomId, nickname: this.nickname });
      });

      socket.on('updateGameState', (gameState) => {
        console.log('[STORE] Received updateGameState:', JSON.parse(JSON.stringify(gameState)));
        this.votesRevealed = gameState.votesRevealed;
        this.participants = gameState.participants;
        this.roomAdminId = gameState.adminId;
        console.log('[STORE] Store participants after update:', JSON.parse(JSON.stringify(this.participants)));
        console.log('[STORE] Store roomAdminId:', this.roomAdminId);
        console.log('[STORE] Is current user admin?', this.isCurrentUserAdmin);
      });
      
      socket.on('roundReset', () => {
        console.log('[STORE] Received roundReset');
        this.selectedCard = null;
      });
    },
    
    disconnect() {
      console.log('[STORE] disconnect action called');
      socket.disconnect();
    },

    selectCard(cardValue) {
      if (this.votesRevealed) return; // Oylar açıksa yeni seçim yapma/değiştirme

      if (this.selectedCard === cardValue) {
        this.selectedCard = null;
      } else {
        this.selectedCard = cardValue;
      }
      console.log('[STORE] Emitting castVote:', { roomId: this.roomId, vote: this.selectedCard });
      socket.emit('castVote', { roomId: this.roomId, vote: this.selectedCard });
    },

    // Bu, HomeView'dan kullanıcının girdiği ismi alır ve store'daki nickname'i günceller.
    // Bu nickname, connect action'ı içindeki joinRoom emit'inde kullanılır.
    setNickname(name) {
      this.nickname = name;
      // localStorage.setItem('nickname', name); // Bu zaten HomeView'da yapılıyor. İsteğe bağlı.
    },

    revealVotes() { // Bu action artık 'toggleVoteVisibility' olayını tetikleyecek
      console.log('[STORE] Emitting toggleVoteVisibility for room:', this.roomId);
      socket.emit('toggleVoteVisibility', this.roomId);
    },

    startNewRound() {
      console.log('[STORE] Emitting newRound for room:', this.roomId);
      this.selectedCard = null; 
      socket.emit('newRound', this.roomId);
    }
  }
})