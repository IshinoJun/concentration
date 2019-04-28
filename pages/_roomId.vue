<template>
  <div class="board">
    <template v-if="$store.state.rooms[roomId]">
      <img
        v-for="card in $store.state.rooms[roomId].cards"
        :key="card.num"
        :src="card.opened ? src(card.num) : backside"
        :style="{ opacity: card.matched ? 0 : 1 }"
        @click="openCard(card.num)"
      >
      <div class="room-btn-box">
        <nuxt-link
          v-for="(room, i) in $store.state.rooms"
          :key="i"
          :to="`/${i}`">
          <button>{{ i }}</button>
        </nuxt-link>
      </div>
    </template>
  </div>
</template>

<script>
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

export default {
  async fetch({ store, route }) {
    await store.dispatch('checkRoom', +route.params.roomId)
  },
  computed: {
    roomId() {
      return +this.$route.params.roomId
    },
    src: () => num => require(`../assets/trump/${num}.gif`),
    backside: () => require('../assets/trump/z01.gif')
  },
  data() {
    return {
      prevNum: null
    }
  },
  async mounted() {
    while (true) {
      await this.$store.dispatch('fetchRoom', this.roomId)
      await sleep(800)
    }
  },
  methods: {
    async openCard(num) {
      await this.$store.dispatch('openCard', { roomId: this.roomId, num })

      if (this.$store.state.rooms[this.roomId].turn === 0) {
        await sleep(1000)

        if (this.prevNum % 13 === num % 13) {
          await this.$store.dispatch('clearCard', { roomId: this.roomId, num, prevNum: this.prevNum })
        } else {
          await this.$store.dispatch('closeCard', { roomId: this.roomId })
        }
      }

      this.prevNum = num
    }
  }
}
</script>

<style scoped>
.board {
  min-height: 100vh;
  background: #070;
}

.room-btn-box {
  position: fixed;
  top: 10px;
  right: 10px;
}

.room-btn-box button {
  width: 100px;
}
</style>
