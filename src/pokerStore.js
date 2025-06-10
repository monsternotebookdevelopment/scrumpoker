import { defineStore } from "pinia";
import socket from "@/socket";

export const usePokerStore = defineStore("poker", {
  state: () => ({
    roomId: null,
    nickname: "",
    socketId: null,
    fibonacciDeck: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55],
    participants: [],
    selectedCard: null,
    votesRevealed: false,
    roomAdminId: null,
  }),

  getters: {
    averageVote: (state) => {
      const validVotes = state.participants
        .map((p) => p.vote)
        .filter((vote) => typeof vote === "number");
      if (validVotes.length === 0) {
        return "-";
      }
      const sum = validVotes.reduce((acc, vote) => acc + vote, 0);
      return (sum / validVotes.length).toFixed(1);
    },
    votedCount: (state) => {
      return state.participants.filter((p) => p.vote !== null).length;
    },
    isCurrentUserAdmin: (state) => {
      return (
        state.socketId &&
        state.roomAdminId &&
        state.socketId === state.roomAdminId
      );
    },
  },

  actions: {
    connect(roomId) {
      this.roomId = roomId;
      socket.connect();

      socket.on("connect", () => {
        this.socketId = socket.id;
        socket.emit("joinRoom", { roomId: this.roomId, nickname: this.nickname });
      });

      socket.on("updateGameState", (gameState) => {
        this.votesRevealed = gameState.votesRevealed;
        this.participants = gameState.participants;
        this.roomAdminId = gameState.adminId;
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