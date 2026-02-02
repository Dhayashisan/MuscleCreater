<script setup>

const iscancel= () => {
  console.log('test');
  isTraining.value = true;
}
</script>

<template>
  <section class="training">
    <h2>Training</h2>
    <button @click="iscancel()">cancel</button>
  </section>
</template>

<style scoped>
.training {
  padding: 20px;
}
</style>