<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../utils/supabase'
import { toJST, startRestTimer } from '@/common/util'
import ChestExerciseSelect from '@/parts/ChestExerciseSelect.vue'
//import { chestJson } from '@/common/exercise'

const emit = defineEmits(['go-top'])
// フォームのデータをrefで管理
const exercise = ref('')
const weight = ref('')
const sets = ref('')
const reps = ref('')
const comment = ref('')
const trainings = ref([])
const restSeconds = ref(0)
const videoUrl = ref('')
const cautionMessage = ref('')
let timerId = null

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
      cautionMessage.value = '⚠️ 肩甲骨を寄せて胸を張り、補助バーとセーフティを必ず確認してください'
      break

    case 'インクラインダンベルプレス':
      cautionMessage.value = '⚠️ ベンチ角度は30〜45度。反動を使わずコントロール重視で'
      break

    case 'ダンベルフライ':
      cautionMessage.value = '⚠️ 肘を伸ばし切らず、肩に過度なストレスをかけないよう注意'
      break

    case '腕立て伏せ':
      cautionMessage.value = '⚠️ 体幹を一直線に保ち、腰が反らないよう意識してください'
      break

    default:
      cautionMessage.value = ''
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

// Top画面へ遷移する。
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
      alert('おちんちんがふっくらしてきたよ！')
      fetchTrainings()
      resetForm()
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
const isContinue = () => {
  sets.value = ''
  reps.value = ''
}

// youtubeの音楽を探す
const musicOn = () => {
  window.open('https://www.youtube.com/watch?v=zLpsmg3W1qE', '_blank')
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
        <ChestExerciseSelect v-model="exercise" />
      </div>
      <div v-if="cautionMessage" class="caution">
        {{ cautionMessage }}
      </div>

      <div class="row">
        <label>セット</label>
        <input type="text" v-model="sets" />
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

      <div class="flex-row">
        <button @click="isOK">OK</button>
        <button @click="isContinue">ちんちん</button>
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
</style>
