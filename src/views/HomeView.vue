<template>
  <div class="home-container">
    <div class="content-block">
      <div class="logo-container">
        <img src="@/assets/monster-logo.svg" alt="Monster Poker Logo" class="main-logo" />
      </div>

      <transition name="fade" mode="out-in">
        <div v-if="!mode" class="panel action-selector" key="selection">
          <button @click="mode = 'create'" class="action-btn">Yeni Oda Oluştur</button>
          <button @click="mode = 'join'" class="action-btn">Odaya Katıl</button>
        </div>

        <div v-else class="panel form-container" key="form">
          <h2 v-if="isDirectLink"></h2>
          <h2 v-else-if="mode === 'create'"></h2>
          <h2 v-else-if="mode === 'join'"></h2>

          <input type="text" v-model="nickname" placeholder="İsim" @keyup.enter="proceed" />

          <input v-if="mode === 'join' && !isDirectLink" type="text" v-model="roomId" placeholder="Oda Kodu"
            @keyup.enter="proceed" @input="checkExistingNickname" />

          <button @click="proceed" class="proceed-btn">Devam</button>
          <button v-if="!isDirectLink" @click="mode = null" class="back-btn">Geri</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePokerStore } from '@/stores/pokerStore';

const mode = ref(null);
const isDirectLink = ref(false);
const nickname = ref('');
const roomId = ref('');
const router = useRouter();
const route = useRoute();
const store = usePokerStore();
const storageKey = 'pokerSessionData';

function getSessionData() {
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : {};
}
function saveSessionData(currentRoomId, currentNickname) {
  const sessions = getSessionData();
  sessions[currentRoomId.toUpperCase()] = currentNickname;
  localStorage.setItem(storageKey, JSON.stringify(sessions));
}
function checkExistingNickname() {
  const sessions = getSessionData();
  const upperCaseRoomId = roomId.value.toUpperCase();
  if (upperCaseRoomId && sessions[upperCaseRoomId]) {
    nickname.value = sessions[upperCaseRoomId];
  }
}
function proceed() {
  if (!nickname.value) {
    alert('Lütfen bir isim girin!');
    return;
  }
  let targetRoomId = '';
  let targetPath = '';
  if (isDirectLink.value) {
    const pathParts = route.query.redirect.split('/');
    targetRoomId = pathParts[pathParts.length - 1].toUpperCase();
    targetPath = route.query.redirect;
  } else if (mode.value === 'create') {
    targetRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    targetPath = `/room/${targetRoomId}`;
  } else if (mode.value === 'join') {
    if (!roomId.value) {
      alert('Lütfen oda kodunu girin!');
      return;
    }
    targetRoomId = roomId.value.toUpperCase();
    targetPath = `/room/${targetRoomId}`;
  }
  store.setNickname(nickname.value);
  saveSessionData(targetRoomId, nickname.value);
  router.push(targetPath);
}
onMounted(() => {
  if (route.query.redirect) {
    isDirectLink.value = true;
    mode.value = 'join';
    const pathParts = route.query.redirect.split('/');
    const directRoomId = pathParts[pathParts.length - 1].toUpperCase();
    const sessions = getSessionData();
    if (sessions[directRoomId]) {
      nickname.value = sessions[directRoomId];
    } else {
      nickname.value = '';
    }
  } else {
    nickname.value = '';
  }
});
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 40px);
}

.content-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-container {
  margin-bottom: 50px;
}

.main-logo {
  max-width: 450px;
  width: 450px;
  height: auto;
}

.panel {
  width: 300px;
}

.action-selector {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-btn {
  padding: 20px 40px;
  font-size: 1.2rem;
  background-color: #222;
  color: #fff;
  border: 2px solid var(--monster-green);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--monster-green);
  color: #111;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h2 {
  color: #ccc;
  font-size: 1rem;
  margin: 0;
  text-align: center;
  margin-bottom: 10px;
}

input {
  padding: 12px;
  background-color: #222;
  border: 1px solid #444;
  color: #fff;
  border-radius: 5px;
  text-align: center;
}

input::placeholder {
  text-transform: none;
}

.proceed-btn,
.back-btn {
  margin-top: 10px;
}

.proceed-btn {
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  background-color: var(--monster-green);
  color: #111;
  font-size: 1rem;
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>