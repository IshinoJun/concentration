const router = require('express').Router()
const state = {
  rooms: []
}

const numList = [...Array(52)].map((_, i) => i + 1)

router.get('/rooms/:roomId', (req, res) => {
  res.json(state.rooms[req.params.roomId])
})

router.post('/rooms/:roomId', (req, res) => {
  const randomList = []
  for (let i = 0; i < numList.length; i++) {
    let num = null
    while (!num || randomList.indexOf(num) > -1) {
      num = numList[Math.floor(Math.random() * (numList.length + 1))]
    }
    randomList.push(num)
  }

  state.rooms[req.params.roomId] = {
    turn: 0,
    cards: randomList.map(num => ({
      num,
      matched: false,
      opened: false
    }))
  }

  res.send(200)
})

router.put('/rooms/:roomId', (req, res) => {
  state.rooms[req.params.roomId] = req.body
  res.send(200)
})

module.exports = router
