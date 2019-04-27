export const state = () => ({
  rooms: JSON.parse(localStorage.trump_data || '[]')
})

export const plugins = [
  (store) => {
    store.subscribe(() => {
      localStorage.trump_data = JSON.stringify(store.state.rooms)
    })
  }
]

export const mutations = {
  addRoom(state, room) {
    state.rooms = [...state.rooms, room]
  },
  openCard(state, { roomId, src }) {
  state.rooms = state.rooms.map((room, i) => {
      if (i === roomId) {
        return {
          cards: room.cards.map((card) => {
            return card.src === src
              ? {
                ...card,
                opened: true
              }
              : card
          })
        }
      } else {
        return room
      }
    })
  },
  closeCard(state, { roomId, src }) {
    state.rooms = state.rooms.map((room, i) => {
      if (i === roomId) {
        return {
          cards: room.cards.map((card) => {
            return card.src === src
              ? {
                ...card,
                opened: false
              }
              : card
          })
        }
      } else {
        return room
      }
    })
  }
}
