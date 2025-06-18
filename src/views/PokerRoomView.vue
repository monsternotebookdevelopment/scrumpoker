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

.admin-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px 0;
  margin-bottom: 10px;
  min-height: 44px;
  box-sizing: border-box;
}

/* .hidden class'ı artık kullanılmadığı için kaldırılabilir, ama zararı yok. */
.admin-controls.hidden {
  visibility: hidden;
}

.room-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 40px);
}
.room-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
}
.results-summary {
  padding: 10px 20px;
  background-color: var(--monster-dark-2);
  border-radius: 10px;
  border: 1px solid var(--monster-green);
  box-sizing: border-box; 
  min-height: 85px; 
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.results-summary.visible {
  opacity: 1;
}
.average-label {
  font-size: 0.8rem;
  color: var(--monster-light-2);
}
.average-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--monster-green);
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
  padding: 20px;
  border-top: 1px solid #333;
  background-color: rgba(0,0,0,0.2);
}
</style>