<template>
  <div class="board">
    <template v-if="$store.state.rooms[roomId]">
      <img
        v-for="card in $store.state.rooms[roomId].cards"
        :key="card.src"
        :src="card.opened ? card.src : backside"
        @click="openCard(card.src)"
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
export default {
  computed: {
    imgList() {
      const list = []
      for (let i = 1; i < 53; i += 1) {
        list.push(require(`../assets/trump/${i}.gif`))
      }
      return list
    },
    roomId() {
      return +this.$route.params.roomId
    },
    backside: () => require('../assets/trump/z01.gif')
  },
  created() {
    if (!this.$store.state.rooms[this.roomId]) {
      const randomList = [...this.imgList]

      for (let i = randomList.length - 1; i >= 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [randomList[i], randomList[rand]] = [randomList[rand], randomList[i]]
      }

      this.$store.commit('addRoom', {
        cards: randomList.map(src => ({
          src,
          matched: false,
          opened: false
        }))
      })
    }
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    openCard(src) {
      this.count++
      this.$store.commit('openCard', { roomId: this.roomId, src })
      if (this.count%2 === 0) {
        setTimeout(() => {
          console.log(src)
          this.$store.commit('closeCard', { roomId: this.roomId, src })
        }, 2000)
      }
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
