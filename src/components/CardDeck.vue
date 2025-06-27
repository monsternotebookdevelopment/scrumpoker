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
  grid-template-columns: repeat(5, 70px);
  justify-content: center;
  gap: 12px;
  padding: 0px;
}

.poker-card {
  width: 60px;
  height: 90px;
  background-color: var(--monster-dark-3);
  border: 2px solid #555;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
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
</style>