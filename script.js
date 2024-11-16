// Constants
const emojis = {
  normal: '😊',
  rightClick: '😮',
  win: '😎',
  lose: '😵',
  flag: '🚩',
  mine: '🦈'
}

// Variables
let board = [] // The game grid
let revealedCount = 0 // Number of bombs revealed
let timer = false // For the game timer
let seconds = 0 // For the timer
let gameStarted = false // For the startGame function
let totalCells = 0 // The number of cells
let audio = new Audio('Untitled video - Made with Clipchamp.mp4')
let flagClick = new Audio('rightclick.mp4')
// Function to initiate the game board
let rows = 16 // Number of inner arrays
let columns = 16 // Number of elements in each inner array
let mines = 40

let minesRemain = document.querySelector('#right-side-box').innerHTML
const beginner = document.querySelector('#beginner')
const intermediate = document.querySelector('#intermediate')
const advance = document.querySelector('#advance')

// Functions
// Function to start the game stopwatch
const stopwatch = document.querySelector('#stopwatch')
function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      seconds++
      stopwatch.textContent = seconds
    }, 1000)
  }
}

const initiateBoard = () => {
  board = [] // Reset the board for a new game
  for (let i = 0; i < rows; i++) {
    let innerArray = []
    for (let j = 0; j < columns; j++) {
      innerArray.push({
        revealed: false,
        flagged: false,
        mine: false,
        adjacentMines: 0
      })
    }
    board.push(innerArray)
  }
  totalCells = rows * columns - mines
  placeMines()
  calculateAdjacents()
  console.log(board)
}

// Function to generate mines
const placeMines = () => {
  let placedMines = 0
  while (placedMines < mines) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * columns)
    if (!board[row][col].mine) {
      board[row][col].mine = true // Only set the mine property
      placedMines++
    }
  }
}

// Function to calculate the number of mines surrounding each cell
const calculateAdjacents = () => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c].mine) {
        continue // Skip mine cells
      }
      let count = 0
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = r + i
          const newCol = c + j
          // Check boundaries
          if (
            newRow >= 0 &&
            newRow < rows &&
            newCol >= 0 &&
            newCol < columns &&
            board[newRow][newCol].mine
          ) {
            count++ // Increment count for each adjacent mine
          }
        }
      }
      board[r][c].adjacentMines = count // Set the count of adjacent mines
    }
  }
}

// Function to create a unique ID for each cell
const squareId = (r, c) => {
  return `cell(${r},${c})`
}

// Function to print the grid on the screen
const printGrid = () => {
  let table, tr, td
  const grid = document.querySelector('#grid')
  grid.textContent = '' // Clear previous grid
  table = document.createElement('table')
  grid.appendChild(table)

  for (let r = 0; r < board.length; r++) {
    tr = document.createElement('tr')
    table.appendChild(tr)

    for (let c = 0; c < board[r].length; c++) {
      td = document.createElement('td')
      td.id = squareId(r, c)
      td.addEventListener('click', () => {
        if (!gameStarted) {
          startTimer()
          gameStarted = true
        }
        revealCell(r, c)
      })
      td.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        flagCell(r, c)
      })
      td.textContent = ''
      tr.appendChild(td)
    }
  }
}
const gameOver = () => {
  // Iterate over the board and reveal all mines
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c].mine) {
        const td = document.getElementById(squareId(r, c))
        td.classList.add('mine') // Add mine class for styling
        td.innerHTML = emojis.mine // Show the mine emoji
      }
    }
  }
  clearInterval(timer) // Stop the timer
  messageBox.textContent = 'Game Over! You hit a Shark!' // Show game over message
}
// Function to reveal the cell when the player clicks
const revealCell = (row, column) => {
  // If the cell was revealed before, or flagged, then return
  if (board[row][column].revealed || board[row][column].flagged) {
    return
  }

  board[row][column].revealed = true
  revealedCount++

  const td = document.getElementById(squareId(row, column))
  td.classList.add('revealed')

  // Check if the cell is a mine
  if (board[row][column].mine) {
    gameOver()

    body.style.backgroundImage =
      "url('https://th.bing.com/th/id/R.75da500dcfd5b8dcd13d811667205f55?rik=0euedb0IWDkLOw&riu=http%3a%2f%2fmedia.giphy.com%2fmedia%2fNZymcDPuVrVZu%2fgiphy.gif&ehk=8xus2w%2f5xowTgSx2aDren6WW4fTh1EGFJHXsmBpMITY%3d&risl=&pid=ImgRaw&r=0')"

    audio.play()
    return
  }
  // Show the number of adjacent mines or an empty string if there are none
  if (board[row][column].adjacentMines > 0) {
    td.textContent = board[row][column].adjacentMines // Show the count of adjacent mines
  } else {
    td.textContent = '' // Show nothing if there are no adjacent mines
    td.style.backgroundColor = 'grey'
    td.style.border = 'none'
  }

  // If there are no adjacent mines, reveal adjacent cells
  if (board[row][column].adjacentMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i
        const newCol = column + j
        // Check if the new cell is within the board boundaries
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns) {
          revealCell(newRow, newCol) // Recursively reveal adjacent cells
        }
      }
    }
  }
  checkWin()
}

// Function to put a flag if the cell was right-clicked
const flagCell = (row, column) => {
  const td = document.getElementById(squareId(row, column))
  const cell = board[row][column]

  cell.flagged = !cell.flagged // Toggle the flagged state

  td.classList.toggle('flag')

  if (cell.flagged) {
    flagClick.play()
    td.textContent = emojis.flag // Show flag emoji
  } else {
    td.textContent = '' // Clear the cell
  }
}

// Function to check winning condition
const checkWin = () => {
  if (revealedCount === totalCells) {
    messageBox.textContent = 'Congratulations, You Win!'
    clearInterval(timer)
  }
}
body = document.getElementById('index')
messageBox = document.getElementById('message')
// Function to restart the game
const restartGame = () => {
  clearInterval(timer)
  seconds = 0
  document.querySelector('#stopwatch').textContent = seconds
  revealedCount = 0
  gameStarted = false
  timer = false
  totalCells = 0
  initiateBoard()
  printGrid()
  body.style.backgroundImage =
    "url('https://th.bing.com/th/id/R.a61d96f23882c8e5a47ab16a6a7d7207?rik=QGLtMMZ1AoMqYw&riu=http%3a%2f%2fwww.pixelstalk.net%2fwp-content%2fuploads%2f2016%2f06%2fOcean-underwater-light-wallpaper-hd.jpg&ehk=RLmSM8K8ZQQn3YDnpMQGZfb5E3dJHQENNRqudKJONlY%3d&risl=1&pid=ImgRaw&r=0')"

  messageBox.textContent = ''
  grid.style.fontSize = '1em'
  audio.pause()
}

// Setup event listeners for difficulty buttons
document.getElementById('reset-button').addEventListener('click', restartGame)

beginner.addEventListener('click', () => {
  rows = 9
  columns = 9
  mines = 10
  restartGame()
})

intermediate.addEventListener('click', () => {
  rows = 16
  columns = 16
  mines = 40
  restartGame()
})

advance.addEventListener('click', () => {
  rows = 16
  columns = 30
  mines = 99
  restartGame()
})
// Start the game for the first time
restartGame()
