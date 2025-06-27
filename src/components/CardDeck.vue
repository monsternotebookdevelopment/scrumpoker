<template>
  <div class="card-deck-container">
    <div v-for="card in store.fibonacciDeck" :key="card" class="poker-card"
      :class="{ 'selected': store.selectedCard === card }" @click="store.selectCard(card)">
      {{ card }}
    </div>
  </div>
</template>

<script setup>
import { usePokerStore } from '@/stores/pokerStore';
const store = usePokerStore();
</script>

<style scoped>
.card-deck-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: center;
  gap: 8px;
  padding: 0;
  width: 100%;
  max-width: 270px; /* Son küçültme */
  margin: 0 auto;
  transition: max-width 0.3s ease;
}

.poker-card {
  aspect-ratio: 2 / 3;
  font-size: 1.0rem; /* Son küçültme */
  width: 100%;
  background-color: var(--monster-dark-3);
  border: 2px solid #555;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.poker-card:hover {
  border-color: var(--monster-green);
  transform: translateY(-5px);
}

.poker-card.selected {
  background-color: var(--monster-green);
  color: var(--monster-dark);
  border-color: var(--monster-light-1);
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 0 15px var(--monster-green);
}

/* --- EKRAN KIRILIM NOKTALARI (BREAKPOINTS) --- */

@media (max-width: 768px) {
  .card-deck-container {
    max-width: 240px;
  }
  .poker-card {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .card-deck-container {
    max-width: 200px;
    gap: 5px;
  }
  .poker-card {
    font-size: 0.8rem;
    border-radius: 5px;
  }
}
</style>