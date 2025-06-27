<template>
  <div class="room-container">
    <header class="room-header">
      <img src="@/assets/monster-logo.svg" alt="Logo" class="header-logo" />
      <div class="room-info">
        Oda Kodu: <strong>{{ store.roomId }}</strong>
      </div>
    </header>
    
    <main class="game-area">
      <div class="results-summary" :class="{ visible: store.votesRevealed }">
        <div class="average-label">ORTALAMA</div>
        <div class="average-value">{{ store.averageVote }}</div>
      </div>
      
      <VotingArea />
    </main>

    <div class="admin-controls">
      <button 
        @click="store.revealVotes" 
        :disabled="!store.votesRevealed && store.votedCount === 0"
      >
        {{ store.votesRevealed ? 'Oyları Gizle' : 'Oyları Göster' }}
      </button>
      <button @click="store.startNewRound">Yeni Tur</button>
    </div>
    
    <footer class="deck-area">
      <CardDeck />
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePokerStore } from '@/stores/pokerStore';
import VotingArea from '@/components/VotingArea.vue';
import CardDeck from '@/components/CardDeck.vue';

const store = usePokerStore();
const route = useRoute();
const router = useRouter();

onMounted(() => {
  if (!store.nickname) {
    router.push({ name: 'home', query: { redirect: route.fullPath } });
    return;
  }
  const roomId = route.params.roomId;
  store.connect(roomId);
});

onUnmounted(() => {
  store.disconnect();
});
</script>

<style scoped>
.room-container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  box-sizing: border-box;
  padding: 0 20px 20px 20px;
}

.room-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #333;
}

.header-logo {
  height: 30px;
}

.room-info {
  color: #888;
}

.game-area {
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-top: 70px; /* Ortalama kutusu için üstte 70px'lik bir güvenli alan yaratıyoruz. */
  box-sizing: border-box; /* Padding'in, alanın boyutunu etkilememesi için. */
}

.results-summary {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  padding: 5px 15px; 
  background-color: var(--monster-dark-2);
  border-radius: 10px;
  border: 1px solid var(--monster-green);
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

.results-summary.visible {
  opacity: 1;
}

.average-label {
  font-size: 0.7rem;
}

.average-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--monster-green);
}

.admin-controls {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px 0;
  min-height: 44px;
  box-sizing: border-box;
}

.admin-controls button {
  padding: 10px 20px;
  background-color: var(--monster-dark-3);
  color: var(--monster-light-1);
  border: 1px solid var(--monster-green);
  border-radius: 5px;
  cursor: pointer;
}

.admin-controls button:disabled {
  border-color: #444;
  color: #666;
  cursor: not-allowed;
}

.deck-area {
  flex-shrink: 0;
  padding-top: 20px;
  border-top: 1px solid #333;
  background-color: rgba(0,0,0,0.2);
}

@media (max-width: 600px) {
  .admin-controls {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .admin-controls button {
    width: 80%;
    max-width: 250px;
  }
}

/* Telefonlar (480px ve altı) - YENİ KURAL */
@media (max-width: 480px) {
  .results-summary {
    padding: 3px 12px;
    top: 10px; /* Yukarıya biraz daha yakın */
  }
  .average-label {
    font-size: 0.6rem;
  }
  .average-value {
    font-size: 1.6rem;
  }
}
</style>