<script setup>
import { ref, watch } from 'vue'
import { supabase } from '../utils/supabase'
import { toJST, startRestTimer, toHalfWidthNumber } from '@/common/util'
import ChestExerciseSelect from '@/parts/ChestExerciseSelect.vue'
import cautionMessages from '@/common/cautionMessages.json'

const emit = defineEmits(['go-top'])
// フォームのデータをrefで管理
const exercise = ref('')
const weight = ref('')
const sets = ref('')
const reps = ref('')
const comment = ref('')
const trainings = ref([])
const restSeconds = ref(0)
const cautionMessage = ref('')
const showCautionScreen = ref(false)
const showCautionSidebar = ref(false)

// トレーニングを開始する前にフォームを意識づけるスクリーンを表示する。
const startTraining = () => {
  showCautionScreen.value = false
  showCautionSidebar.value = true
}

// 選んだ種目、セット目によって取得先を変更する処理
watch([exercise, sets], ([newExercise, newSets]) => {
  // 両方そろってから取得
  if (!newExercise || !newSets) {
    trainings.value = []
    return
  }

  fetchTrainings(newExercise, parseInt(newSets))
})

// 選んだ種目により、フォームを意識づける
watch(exercise, (newVal) => {
  switch (newVal) {
    case 'ベンチプレス':
      cautionMessage.value = cautionMessages.BP
      break
    case 'インクラインダンベルプレス':
      cautionMessage.value = cautionMessages.INDBFLY
      break
    case 'ダンベルフライ':
      cautionMessage.value = cautionMessages.DBFLY
      break
    case '腕立て伏せ':
      cautionMessage.value = cautionMessages.PUSHUP
      break
    default:
      cautionMessage.value = ''
      return
  }

  // 注意メッセージがあればフルスクリーン表示
  if (cautionMessage.value) {
    showCautionScreen.value = true
  }
})

// トレーニングのデータを取得
const fetchTrainings = async (exerciseName, setCount) => {
  const { data, error } = await supabase
    .from('TraningDatabase')
    .select('*')
    .eq('muscle_group', '胸')
    .eq('exercise', exerciseName)
    .eq('sets', setCount)
    .order('training_date', { ascending: false })
    .limit(1)

  if (error) {
    console.error('取得エラー', error)
    trainings.value = []
    return
  }

  trainings.value = data
}

// OKボタンでDBに登録
const isOK = async (flag) => {
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
      weight: weight.value,
      sets: parseInt(sets.value),
      reps: reps.value,
      comment: comment.value,
    })

  startRestTimer({
    seconds: 10,
    onTick: (sec) => {
      restSeconds.value = sec
    },
    onFinish: () => {
      alert('インターバル終了')
      fetchTrainings()
      // OKなら次の種目　継続なら必要な値を保持
      if (flag === 'insert') {
        resetForm()
      } else {
        isContinue()
      }
    },
  })
}

// 初期化処理
const resetForm = () => {
  exercise.value = ''
  weight.value = ''
  sets.value = ''
  reps.value = ''
  comment.value = ''
}

// もし継続ならセット数を前回入力した値から＋１する関数
const isContinue = () => {
  sets.value = parseInt(sets.value) + parseInt(1)
  reps.value = ''
  comment.value = ''
}

// youtubeの音楽を探す
const musicOn = () => {
  window.open('https://www.youtube.com/watch?v=zLpsmg3W1qE', '_blank')
}

// Top画面へ遷移する。
const isTop = () => {
  emit('go-top')
}
</script>

<template>
  <!-- フルスクリーン注意画面 -->
  <div v-if="showCautionScreen" class="caution-screen">
    <div class="caution-content">
      <h2>⚠️ トレーニング前の注意 ⚠️</h2>
      <p>{{ cautionMessage }}</p>
      <button @click="startTraining">トレーニング開始</button>
    </div>
  </div>

  <!-- 右端注意パネル -->
  <div v-if="showCautionSidebar" class="caution-sidebar">
    <h3>⚠️ 注意 ⚠️</h3>
    <p>{{ cautionMessage }}</p>
  </div>
  <h2>ChestDay</h2>
  <div class="header">
    <button @click="isTop">Top</button>
  </div>
  <div class="flex-box">
    <div class="training-box">
      <div class="row">
        <label>種目</label>
        <ChestExerciseSelect v-model="exercise" />
      </div>

     <div class="row small-input">
  <label>セット</label>
  <input type="text" v-model="sets" @input="sets = toHalfWidthNumber(sets)" />
</div>

<div class="row small-input">
  <label>重量(kg)</label>
  <input type="text" v-model="weight" @input="weight = toHalfWidthNumber(weight)" />
</div>

<div class="row small-input">
  <label>回数</label>
  <input type="text" v-model="reps" @input="reps = toHalfWidthNumber(reps)"/>
</div>

<div class="row large-input">
  <label>メモ</label>
  <textarea placeholder="フォーム・感覚など" v-model="comment"></textarea>
</div>

      <div class="flex-row">
        <button @click="isOK('insert')">OK</button>
        <button @click="isOK('continue')">継続</button>
      </div>
    </div>

    <!--記録を表示する-->

    <div class="training-box" v-if="trainings.length">
      <h3>前回の記録</h3>

      <div v-for="t in trainings" :key="t.id" class="row">
        <div>日付：{{ toJST(t.training_date) }}</div>
        <div>セット：{{ t.sets }}</div>
        <div>種目：{{ t.exercise }}</div>
        <div>重量：{{ t.weight }} kg</div>
        <div>回数：{{ t.reps }} 回</div>
        <div>メモ：{{ t.comment }}</div>
        <hr />
      </div>
    </div>
  </div>
  <div v-if="restSeconds > 0" class="timer-box">インターバル：{{ restSeconds }} 秒</div>

  <button @click="musicOn">Music On</button>
</template>

<style scoped>
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
  width: 1080px;
}

.flex-row {
  display: flex;
}

/* フルスクリーン */
.caution-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: #fff;
}

.caution-content {
  max-width: 600px;
  text-align: center;
  padding: 32px;
  border: 2px solid #ff5555;
  background-color: #1e1e1e;
  border-radius: 12px;
}

.caution-content h2 {
  margin-bottom: 20px;
  color: #ff5555;
}

.caution-content p {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 30px;
}

.caution-content button {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #ff5555;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #fff;
}

/* 右端注意パネル */
.caution-sidebar {
  position: fixed;
  top: 20px;
  right: 500px;
  width: 500px;
  max-width: 100%;
  background-color: #1e1e1e;
  border: 2px solid #ff5555;
  padding: 16px;
  border-radius: 8px;
  color: #fff;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
}

.caution-sidebar h3 {
  margin-bottom: 10px;
  color: #ff5555;
}

.caution-sidebar p {
  font-size: 14px;
  line-height: 1.4;
}

/* 小さい入力欄（rep/set/weight） */
.row.small-input input {
  width: 120px;
  padding: 6px 8px;
  border: 1px solid #666;
  background-color: #2a2a2a;
  color: #ffffff;
  font-size: 14px;
  border-radius: 4px;
}

/* コメント欄を大きく */
.row.large-input textarea {
  width: 100%;
  height: 120px;
  padding: 10px;
  border: 1px solid #666;
  background-color: #2a2a2a;
  color: #ffffff;
  font-size: 14px;
  border-radius: 4px;
  resize: vertical;
}

/* ラベルは元デザイン */
.row label {
  font-size: 12px;
  margin-bottom: 4px;
  color: #bbbbbb;
}
</style>
