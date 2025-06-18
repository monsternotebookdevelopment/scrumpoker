import { defineStore } from "pinia";
import socket from "@/socket";

function getPersistentUserId() {
  let userId = localStorage.getItem('pokerUserId');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('pokerUserId', userId);
  }
  return userId;
}

export const usePokerStore = defineStore("poker", {
  state: () => ({
    roomId: null,
    nickname: "",
    socketId: null,
    persistentUserId: getPersistentUserId(),
    fibonacciDeck: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55],
    participants: [],
    selectedCard: null,
    votesRevealed: false,
    // roomAdminId kaldırıldı.
  }),

  getters: {
    averageVote: (state) => {
      const validVotes = state.participants.map((p) => p.vote).filter((vote) => typeof vote === "number");
      if (validVotes.length === 0) { return "-"; }
      const sum = validVotes.reduce((acc, vote) => acc + vote, 0);
      return (sum / validVotes.length).toFixed(1);
    },
    votedCount: (state) => {
      return state.participants.filter((p) => p.vote !== null).length;
    },
    // isCurrentUserAdmin getter'ı kaldırıldı.
  },

  actions: {
    connect(roomId) {
      this.roomId = roomId;
      socket.connect();

      socket.on("connect", () => {
        this.socketId = socket.id;
        socket.emit("joinRoom", { 
          roomId: this.roomId, 
          nickname: this.nickname, 
          userId: this.persistentUserId 
        });
      });

      socket.on("updateGameState", (gameState) => {
        this.votesRevealed = gameState.votesRevealed;
        this.participants = gameState.participants;
        // this.roomAdminId ataması kaldırıldı.
      });
      
      socket.on("roundReset", () => {
        this.selectedCard = null;
      });
    },

    disconnect() {
      socket.disconnect();
    },

    selectCard(cardValue) {
      if (this.votesRevealed) return;
      if (this.selectedCard === cardValue) {
        this.selectedCard = null;
      } else {
        this.selectedCard = cardValue;
      }
      socket.emit("castVote", { roomId: this.roomId, vote: this.selectedCard });
    },

    setNickname(name) {
      this.nickname = name;
    },

    revealVotes() {
      socket.emit("toggleVoteVisibility", this.roomId);
    },

    startNewRound() {
      this.selectedCard = null;
      socket.emit("newRound", this.roomId);
    },
  },
});