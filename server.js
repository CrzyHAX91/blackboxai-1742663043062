const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors())
app.use(bodyParser.json())

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')))

// Serve index.html on root request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Serve login.html
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

// Serve dashboard.html
app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'))
})

const posts = []
const tracks = {}
const users = [{ username: 'testuser', password: 'testpass', token: 'fake-jwt-token' }]

app.get('/api/social/posts', (req, res) => {
  res.json(posts)
})

app.post('/api/social/posts', (req, res) => {
  const post = req.body
  posts.push(post)
  res.status(201).json(post)
})

app.post('/api/ai/moderate', (req, res) => {
  res.json({ moderationResult: 'clean' })
})

app.post('/api/music/upload', (req, res) => {
  const trackId = '12345'
  tracks[trackId] = { id: trackId, data: 'dummy audio data' }
  res.status(201).json({ trackId })
})

app.get('/api/music/:id', (req, res) => {
  const track = tracks[req.params.id]
  if (track) {
    res.json(track)
  } else {
    res.status(404).send('Not found')
  }
})

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  const user = users.find(u => u.username === username && u.password === password)
  if (user) {
    res.json({ token: user.token })
  } else {
    res.status(401).send('Unauthorized')
  }
})

app.get('/api/protected', (req, res) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '')
  const user = users.find(u => u.token === token)
  if (user) {
    res.json({ message: 'Access granted' })
  } else {
    res.status(401).send('Unauthorized')
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
