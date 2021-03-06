export const state = () => ({
  rooms: []
})

export const mutations = {
  setRoom(state, { room, roomId }) {
    state.rooms = [...state.rooms]
    state.rooms[roomId] = room
  }
}

export const actions = {
  async fetchRoom(store, roomId) {
    const roomInfo = await this.$axios.$get(`https://app-concentration.herokuapp.com/api/rooms/${roomId}`)
    store.commit('setRoom', { room: roomInfo, roomId })
  },
  async checkRoom(store, roomId) {
    let room = await this.$axios.$get(`https://app-concentration.herokuapp.com/api/rooms/${roomId}`)

    if (!room) {
      await this.$axios.$post(`https://app-concentration.herokuapp.com/api/rooms/${roomId}`)
      room = await this.$axios.$get(`https://app-concentration.herokuapp.com/api/rooms/${roomId}`)
    }

    store.commit('setRoom', { room, roomId })
  },
  async openCard(store, { roomId, num }) {
    const room = { ...store.state.rooms[roomId] }
    room.cards = room.cards.map((card) => {
      if (card.num === num) {
        if (card.opened == false) {
          room.turn = 1 - room.turn
          return { ...card, opened: true }
        } else {
          return card
        }
      } else {
        return card
      }
    })
    await this.$axios.$put(`https://app-concentration.herokuapp.com/api/rooms/${roomId}`, room)

    await store.dispatch('fetchRoom', roomId)
  },
  async closeCard(store, { roomId }) {
    const room = { ...store.state.rooms[roomId] }

    room.cards = room.cards.map((card) => {
      if (card.opened) {
        return { ...card, opened: false }
      } else {
        return card
      }
    })
    await this.$axios.$put(`https://app-concentration.herokuapp.com/api/rooms/${roomId}`, room)

    await store.dispatch('fetchRoom', roomId)
  },
  async clearCard(store, { roomId, num, prevNum }) {
    const room = { ...store.state.rooms[roomId] }

    room.cards = room.cards.map((card) => {
      if (card.num === num || card.num === prevNum) {
        return { ...card, matched: true }
      } else {
        return card
      }
    })
    await this.$axios.$put(`https://app-concentration.herokuapp.com/api/rooms/${roomId}`, room)

    await store.dispatch('fetchRoom', roomId)
  }
}
