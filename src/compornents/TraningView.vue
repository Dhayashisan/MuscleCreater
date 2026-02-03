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
    <h2>Training</h2>
    <div v-if="isTraningMode === 'Chest'">
      <Chest @go-top="goTop" />
    </div>
    <div v-if="isTraningMode === 'back'"></div>
    <div v-if="isTraningMode === null">
      <button @click="isChest">chest</button>
      <button @click="iscancel">back</button>
      <button @click="iscancel">shoulder</button>
      <button @click="iscancel">arm</button>
      <button @click="iscancel">leg</button>
      <button @click="iscancel">cancel</button>
    </div>
  </section>
</template>

<style scoped>
.training {
  padding: 20px;
}
</style>
