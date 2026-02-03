<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../utils/supabase'
import { toJST } from '@/common/util'

const emit = defineEmits(['go-top'])
// フォームのデータをrefで管理
const exercise = ref('')
const weight = ref('')
const reps = ref('')
const comment = ref('')
const trainings = ref([])

// 画面表示時に取得
onMounted(() => {
  fetchTrainings()
})

// トレーニングのデータを取得
const fetchTrainings = async () => {
  const { data, error } = await supabase
    .from('TraningDatabase')
    .select('*')
    .eq('muscle_group', '胸')
    .order('training_date', { ascending: false })
    .limit(1)
  if (error) {
    console.error('取得エラー', error)
    return
  }

  trainings.value = data
}

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
    .insert({
      userid: parseFloat(1),
      training_date: new Date().toISOString(),
      muscle_group: '胸',
      exercise: exercise.value,
      weight: parseFloat(weight.value),
      sets: parseInt(1),
      reps: parseInt(reps.value),
      comment: comment.value,
    })
}
</script>

<template>
  <h2>ChestDay</h2>
  <div class="header">
    <button @click="isTop">Top</button>
  </div>
  <div class="flex-box">
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

    <!--記録を表示する-->

    <div class="training-box" v-if="trainings.length">
      <h3>前回の記録</h3>

      <div v-for="t in trainings" :key="t.id" class="row">
        <div>日付：{{ toJST(t.training_date) }}</div>
        <div>種目：{{ t.exercise }}</div>
        <div>重量：{{ t.weight }} kg</div>
        <div>回数：{{ t.reps }} 回</div>
        <div>メモ：{{ t.comment }}</div>
        <hr />
      </div>
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

.flex-box {
  display: flex;
}
</style>
