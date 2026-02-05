<script setup>
import { ref, onMounted,provide } from 'vue'
import TraningView from '@/compornents/TraningView.vue'
const isMode = ref(false)
const username = ref('')
const isEntered = ref(false)


provide('username', username)

// 初回ロード時：名前が保存されていればスキップ
onMounted(() => {
  const savedName = localStorage.getItem('username')
  if (savedName) {
    username.value = savedName
    isEntered.value = true
  }
})

const enterName = () => {
  if (!username.value) return
  localStorage.setItem('username', username.value)
  isEntered.value = true
}

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
    <div class="login">
      <!-- ① 名前入力画面 -->
      <div v-if="!isEntered" class="loginform">
        <h2>あなたの名前を入力してください</h2>
        <input v-model="username" placeholder="Name" />
        <button @click="enterName">Start</button>
      </div>

      <!-- ② トップ画面 -->
      <div v-else class="main-contents">
        <!-- Training画面 -->
        <div v-if="isMode">
          <TraningView @close-training="closeTraining" />
        </div>

        <!-- メニュー画面 -->
        <div v-else>
          <div class="header">
            <h1>Welcome {{ username }} 💪</h1>
          </div>

          <button @click="showTraining">Training💛</button>
          <button>Edit</button>
          <button>Setting</button>
          <button>Graph</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* =========================
   全体レイアウト
========================= */
main {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-color: #121212;
  color: #fff;
}

.login {
  width: 100%;
  max-width: 960px;
  padding: 16px;
}

/* =========================
   ログイン画面
========================= */
.loginform {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20vh;
}

.loginform input {
  padding: 12px;
  font-size: 16px;
}

.loginform button {
  padding: 12px;
  font-size: 16px;
}

/* =========================
   トップ画面
========================= */
.main-contents {
  width: 100%;
}

.header {
  margin-bottom: 24px;
}

/* メニューボタン */
.main-contents button {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
}

/* =========================
   PC向け微調整
========================= */
@media screen and (min-width: 769px) {
  .login {
    padding: 32px;
  }

  .loginform {
    max-width: 400px;
    margin: 20vh auto 0;
  }

  .main-contents button {
    max-width: 320px;
  }
}
</style>
