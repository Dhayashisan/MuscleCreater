<script setup>
import { ref } from 'vue'
import { supabase } from '../utils/supabase'
const emit = defineEmits(['go-top'])
// フォームのデータをrefで管理
const exercise = ref('')
const weight = ref('')
const reps = ref('')
const comment = ref('')

const isTop = () => {
  emit('go-top')
}

// OKボタンでDBに登録
const isOK = async () => {
  if (!exercise.value || !weight.value || !reps.value) {
    alert('種目・重量・回数は必須です')
    return
  }
  await supabase
    .from('TraningDatabase') // 作成したテーブル名
    .insert(
      {
        userid: parseFloat(1),
        training_date: new Date().toISOString(),
        muscle_group: '胸',
        exercise: exercise.value,
        weight: parseFloat(weight.value),
        sets: parseInt(1),
        reps: parseInt(reps.value),
        comment: comment.value,
      },
    )
}
</script>

<template>
  <h2>ChestDay</h2>
  <div class="header">
    <button @click="isTop">Top</button>
  </div>

  <div class="training-box">
    <div class="row">
      <label>種目</label>
      <input type="text" placeholder="ベンチプレス" v-model="exercise" />
    </div>

    <div class="row">
      <label>重量(kg)</label>
      <input type="text" v-model="weight" />
    </div>

    <div class="row">
      <label>回数</label>
      <input type="text" v-model="reps" />
    </div>

    <div class="row">
      <label>メモ</label>
      <textarea placeholder="フォーム・感覚など" v-model="comment"></textarea>
    </div>

    <div class="row">
      <button @click="isOK">OK</button>
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
