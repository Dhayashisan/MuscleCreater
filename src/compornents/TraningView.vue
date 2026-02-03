<script setup>
import Chest from '@/compornents/Chest.vue'

const emit = defineEmits(['close-training'])
const iscancel = () => {
  emit('close-training')
}
</script>

<template>
  <section class="training">
    <h2>Training</h2>
    <button @click="iscancel">chest</button>
    <Chest />
    <button @click="iscancel">back</button>
    <button @click="iscancel">shoulder</button>
    <button @click="iscancel">arm</button>
    <button @click="iscancel">leg</button>
    <button @click="iscancel">cancel</button>
  </section>
</template>

<style scoped>
.training {
  padding: 20px;
}
</style>
