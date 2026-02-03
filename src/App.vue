<script setup>
import { ref } from 'vue'
import TraningView from '@/compornents/TraningView.vue'
const isMode = ref(false)

const showTraining = () => {
  console.log('test')
  isMode.value = true
}

const closeTraining = () => {
  console.log('test')
  isMode.value = false
}
</script>
<!--マッスル個人的プログラム-->
<!--簡易設計-->
<!--画面は「当日記入画面」「編集画面」「メンテナンス画面」「グラフ画面」-->
<!--★ボディビルを重視したトレーニングを行う為、以下流れを行えるよう意識づける為の管理表。-->
<!--０：アップ　１：意識づけ（フォーム）　２：個人で気を付けること　３：前回の重さ・回数　４：感想-->
<!--ストップウォッチ機能がいるかどうか迷う-->
<!--トレーニング登録タイプ：7ぐらい題名は任せる。-->

<!--★気を付けること-->
<!--淡々とトレーニングをこなせる様、余計な機能を省くこと-->
<template>
  <main>
    <div class="top"></div>
    <!-- メニュー画面 -->
    <div v-if="isMode" class="main-contents">
      <!-- Training画面 -->
      <TraningView @close-training="closeTraining" />
    </div>
    <div v-if="!isMode" class="main-contents">
      <div class="header">
        <h1>Welcome!!!PokochinMuscleSchoooooooooooooool!!!!</h1>
      </div>
      <button @click="showTraining">Training</button>
      <button>Edit</button>
      <button>Maintenance</button>
      <button>Graph</button>
    </div>
  </main>
</template>

<style scoped></style>
