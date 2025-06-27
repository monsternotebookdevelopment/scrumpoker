<template>
  <div class="voting-area-container">
    <div 
      v-for="participant in store.participants" 
      :key="participant.id" 
      class="player-card"
    >
      <div class="card-face" :class="{ 'is-revealed': store.votesRevealed && participant.vote !== null }">
        <div class="card-front">
          {{ participant.vote }}
        </div>
        <div class="card-back">
          <img src="@/assets/eye.png" alt="Card Back" />
        </div>
      </div>
      
      <div class="player-info">
        <div class="player-name">
          <span>{{ participant.name }}</span>
        </div>
        <div class="vote-status-indicator">
  <span class="voted-checkmark" :class="{ 'is-visible': participant.vote !== null }">
    👽
  </span>
</div>
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
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
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
  transition: all 0.3s ease;
}
.card-face.is-revealed {
  transform: rotateY(180deg);
}
.card-front, .card-back {
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
.player-info, .player-name, .vote-status-indicator, .voted-checkmark {
  /* Bu stillerde değişiklik yok, önceki gibi kalabilir */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.player-name {
  font-weight: bold;
  color: var(--monster-light-2);
}
.vote-status-indicator {
  /* Bu yüksekliği sabitliyoruz ki hiç değişmesin */
  height: 1.3rem; 
  display: flex;
  align-items: center;
  justify-content: center;
}

.voted-checkmark {
  color: var(--monster-green);
  font-size: 1rem;
  line-height: 1;
  /* Başlangıçta görünmez yapıyoruz ama yer kaplamaya devam ediyor */
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.voted-checkmark.is-visible {
  /* Oy verildiğinde görünür hale getiriyoruz */
  visibility: visible;
  opacity: 1;
}
@media (max-width: 1024px) {
  .card-face {
    width: 80px;
    height: 125px;
  }
  .card-front, .card-back {
    font-size: 2.2rem;
  }
}
@media (max-width: 768px) {
  .voting-area-container {
    gap: 15px;
  }
  .card-face {
    width: 70px;
    height: 110px;
  }
  .card-front, .card-back {
    font-size: 2rem;
  }
}

/* Telefonlar (480px ve altı) - DAHA BELİRGİN KÜÇÜLME */
@media (max-width: 480px) {
  .card-face {
    width: 55px;
    height: 85px;
    border-radius: 8px;
  }
  .card-front, .card-back {
    font-size: 1.5rem;
    border-radius: 8px;
  }
}
</style>