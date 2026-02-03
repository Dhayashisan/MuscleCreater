<script setup>

const emit = defineEmits(['close-training'])
const iscancel = () => {
  emit('close-training')
}
</script>

<template>
  <section class="training">
    <h2>Training</h2>
    <button @click="iscancel">cancel</button>
  </section>
</template>

<style scoped>
.training {
  padding: 20px;
}
</style>
