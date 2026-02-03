<script setup>
const emit = defineEmits(['go-top'])

const isTop = () => {
  emit('go-top')
}
</script>

<template>

    <h2>ChestDay</h2>
    <div class="header">
      <button @click="isTop">Top</button>
    </div>
    <!-- トレーニング記入枠 -->
    <div class="training-box">
      <div class="row">
        <label>種目</label>
        <input type="text" placeholder="ベンチプレス" />
      </div>

      <div class="row">
        <label>重量(kg)</label>
        <input type="text" />
      </div>

      <div class="row">
        <label>回数</label>
        <input type="text" />
      </div>

      <div class="row">
        <label>メモ</label>
        <textarea placeholder="フォーム・感覚など"></textarea>
      </div>
    </div>
 
</template>

<style scoped>
.training {
  padding: 20px;
  background-color: #121212;
  color: #e0e0e0;
}

/* 枠線 */
.training-box {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #555;
  background-color: #1e1e1e;
}

/* 行 */
.row {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

label {
  font-size: 12px;
  margin-bottom: 4px;
  color: #bbbbbb;
}

input,
textarea {
  padding: 8px;
  background-color: #2a2a2a;
  border: 1px solid #666;
  color: #ffffff;
  font-size: 14px;
}

input::placeholder,
textarea::placeholder {
  color: #888;
}

textarea {
  resize: vertical;
}
</style>
