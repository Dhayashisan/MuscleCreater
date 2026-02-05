<script setup>
import { ref } from 'vue'
import Chest from '@/compornents/Chest.vue'
const isTraningMode = ref(null)
const emit = defineEmits(['close-training'])

const isChest = () => {
  console.log('hoge')
  isTraningMode.value = 'Chest'
}

const iscancel = () => {
  emit('close-training')
}

const goTop = () => {
  // 子の状態リセット
  isTraningMode.value = null
  // 親へ通知
  emit('close-training')
}
</script>

<template>
  <section class="training">
    <h2 class="title">Training</h2>

    <!-- トレーニング画面 -->
    <div v-if="isTraningMode === 'Chest'" class="training-view">
      <Chest @go-top="goTop" />
    </div>

    <!-- メニュー画面 -->
    <div v-if="isTraningMode === null" class="menu">
      <button class="menu-btn" @click="isChest">Chest 💛</button>
      <button class="menu-btn disabled">Back</button>
      <button class="menu-btn disabled">Shoulder</button>
      <button class="menu-btn disabled">Arm</button>
      <button class="menu-btn disabled">Leg</button>

      <button class="menu-btn cancel" @click="iscancel">
        Cancel
      </button>
    </div>
  </section>
</template>

<style scoped>
/* =========================
   全体
========================= */
.training {
  width: 100%;
  min-height: 100vh;
  padding: 16px;
  background-color: #121212;
  color: #fff;
}

/* タイトル */
.title {
  margin-bottom: 20px;
  text-align: center;
}

/* =========================
   メニュー画面
========================= */
.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* メニューボタン */
.menu-btn {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border-radius: 10px;
  border: none;
  background-color: #2a2a2a;
  color: #fff;
  cursor: pointer;
}

/* 未実装 */
.menu-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* キャンセル */
.menu-btn.cancel {
  background-color: #444;
}

/* =========================
   トレーニング表示エリア
========================= */
.training-view {
  width: 100%;
}

/* =========================
   PC向け
========================= */
@media screen and (min-width: 769px) {
  .training {
    max-width: 720px;
    margin: 0 auto;
    padding: 32px;
  }

  .menu-btn {
    font-size: 18px;
    padding: 18px;
  }
}
</style>
