<template>
  <div class="voting-area-container">
    <div v-for="participant in store.participants" :key="participant.id" class="player-card">
      <div class="card-face" :class="{ 'is-revealed': store.votesRevealed && participant.vote !== null }">
        <div class="card-front">
          {{ participant.vote }}
        </div>
        <div class="card-back">
          <span v-if="participant.id === store.socketId && participant.vote !== null">
            {{ participant.vote }}
          </span>
          <img v-else src="@/assets/eye.png" alt="Card Back" />
        </div>
      </div>
      <div class="player-name">
        <span v-if="participant.id === store.socketId" class="you-icon">👑</span>
        {{ participant.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePokerStore } from '@/stores/pokerStore';
const store = usePokerStore();
</script>

<style scoped>
.voting-area-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
  padding: 20px;
  flex-grow: 1;
}

.player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.card-face {
  width: 90px;
  height: 140px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-face.is-revealed {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
}

.card-back {
  background-color: #333;
  border: 2px solid #555;
  color: var(--monster-light-1);
}

.card-back img {
  width: 60%;
  opacity: 0.5;
}

.card-front {
  background-color: var(--monster-light-1);
  color: var(--monster-dark);
  transform: rotateY(180deg);
  border: 2px solid var(--monster-green);
}

.player-name {
  font-weight: bold;
  color: var(--monster-light-2);
}

.you-icon {
  font-size: 0.8rem;
}
</style>