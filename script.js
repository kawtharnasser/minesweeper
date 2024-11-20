// Constants
const emojis = {
  normal: '😊',
  shock: '😮',
  win: '😎',
  lose: '😵',
  flag: '🚩',
  mine: '🦈',
  originMine: '💣'
}

const images = {
  original: {
    normal: '',
    win: '',
    lose: ''
  },
  underwater: {
    normal:
      "url('https://th.bing.com/th/id/R.a61d96f23882c8e5a47ab16a6a7d7207?rik=QGLtMMZ1AoMqYw&riu=http%3a%2f%2fwww.pixelstalk.net%2fwp-content%2fuploads%2f2016%2f06%2fOcean-underwater-light-wallpaper-hd.jpg&ehk=RLmSM8K8ZQQn3YDnpMQGZfb5E3dJHQENNRqudKJONlY%3d&risl=1&pid=ImgRaw&r=0')",
    win: "url('https://th.bing.com/th/id/R.79b885018fac6b9727f2aadb671db40b?rik=9eoZPP%2bJQcYgBA&pid=ImgRaw&r=0')",
    lose: "url('https://th.bing.com/th/id/R.75da500dcfd5b8dcd13d811667205f55?rik=0euedb0IWDkLOw&riu=http%3a%2f%2fmedia.giphy.com%2fmedia%2fNZymcDPuVrVZu%2fgiphy.gif&ehk=8xus2w%2f5xowTgSx2aDren6WW4fTh1EGFJHXsmBpMITY%3d&risl=&pid=ImgRaw&r=0')"
  }
}

// Variables
let board = [] // The game grid in js
let revealedCount = 0 // Number of bombs revealed
let gameStarted = false // For the startGame function
let isGameOver = false // to stop players actions when lose
let isWin = false
let totalCells = 0 // to check for winning

let timer = false // For the game timer
let seconds = 0 // For the timer
let dummyMine = '🦈'
// the initial number of rows, and col
let rows = 9
let columns = 9
let mines = 10

//sound Effects
let loseAudio = new Audio('Untitled video - Made with Clipchamp.mp4')
let flagClick = new Audio('rightclick.mp4')

let winAudio = new Audio('winbrass-39632.mp3')
let explosion = new Audio('explosion-42132.mp3')

//for the theme
let isOriginal = false

//elements selector
//the game levels
const body = document.querySelector('#index') //for design
const beginner = document.querySelector('#beginner')
const intermediate = document.querySelector('#intermediate')
const advance = document.querySelector('#advance')

//game displays
const minesRemain = document.querySelector('#right-side-box')
const emojiButton = document.querySelector('#reset-button')
const stopwatch = document.querySelector('#stopwatch')
const messageBox = document.querySelector('#message')
//the game grid
const grid = document.querySelector('#grid')

//for customization
const original = document.getElementById('original')

const gameDisplayers = document.querySelectorAll('.game-displayer')
const gameMode = document.querySelector('#game-mode')
const title = document.getElementById('title')
const navigation = document.getElementById('navigation')

// Functions
//1) Function to start the game stopwatch
function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      seconds++
      stopwatch.textContent = seconds
    }, 1000)
  }
}

//2) a function that create the game board
const initiateBoard = () => {
  board = [] // Reset the board each round

  for (let i = 0; i < rows; i++) {
    let cellStatues = []
    for (let j = 0; j < columns; j++) {
      cellStatues.push({
        revealed: false,
        flagged: false,
        mine: false,
        adjacentMines: 0
      })
    }
    board.push(cellStatues)
  }
  totalCells = rows * columns - mines
  placeMines()
  calculateAdjacent()
}

//3) Function that add mines to the board
const placeMines = () => {
  let placedMines = 0
  while (placedMines < mines) {
    //to give the bomb a random location
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * columns)
    if (!board[row][col].mine) {
      board[row][col].mine = true
      placedMines++
    }
  }
}

//4) Function to calculate the number of mines surrounding each cell
const calculateAdjacent = () => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      let count = 0 //for each cell
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
            count++ //increase the number
          }
        }
      }
      board[r][c].adjacentMines = count // Set the count for each cell
    }
  }
}

//5) Function to give a unique ID for each cell
const squareId = (r, c) => {
  return `cell(${r},${c})`
} //results like cell(0,0)

//6) Function to print the result of the board function on the screen
const renderGrid = () => {
  let table, tr, td
  grid.textContent = '' // Clear previous grid
  table = document.createElement('table')
  grid.appendChild(table)

  for (let r = 0; r < board.length; r++) {
    tr = document.createElement('tr')
    table.appendChild(tr)

    for (let c = 0; c < board[r].length; c++) {
      td = document.createElement('td')
      td.id = squareId(r, c) //give id to the cell
      td.addEventListener('click', () => {
        //add event listener to all grid cells
        if (!gameStarted) {
          //if the player click on a cell the game, and starts
          startTimer()
          gameStarted = true
        }
        revealCell(r, c) //when the user click reveal the value of the cell
      })

      //contextmenu: An element is right-clicked to open a context menu, from w3school "HTML DOM Events"
      td.addEventListener('contextmenu', (e) => {
        e.preventDefault() //prevent the default menu
        flagCell(r, c) //add a flag emoji when the player right click
      })
      td.textContent = '' //all the cells have the value of empty string
      tr.appendChild(td)
    }
  }
}

//7)a function that return true when gameOver
const gameOver = () => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c].mine) {
        //if the cell contain mine, show the emoji
        const td = document.getElementById(squareId(r, c))
        td.classList.add('mine')
        td.innerHTML = emojis.mine // Show the mine emoji
      }
    }
  }
  clearInterval(timer) // Stop the timer
  emojiButton.innerHTML = emojis.lose //change the emoji button value

  if (isOriginal) {
    body.style.backgroundImage =
      "url('https://pa1.narvii.com/6803/4104ee2d5b7ed40f003bedab5c6d770af9eb2b25_hq.gif')"
    body.style.backgroundColor = 'darkred'
    messageBox.textContent = 'Game Over! You hit a Mine!'
    explosion.play()
  } else {
    body.style.backgroundImage = images.underwater.lose //gameOver background
    messageBox.textContent = 'Game Over! You hit a Shark!'
    loseAudio.play()
  }

  isGameOver = true
}
//8) a Function that reveals the cell when the player clicks
const revealCell = (row, column) => {
  // return when the player win, or lose, or the cell is revealed or flagged before
  if (
    board[row][column].revealed ||
    board[row][column].flagged ||
    isGameOver ||
    isWin
  ) {
    return
  }
  //else
  const td = document.getElementById(squareId(row, column))
  td.classList.add('revealed') //add a class to the cell
  board[row][column].revealed = true
  revealedCount++

  // Check if the cell is a mine
  if (board[row][column].mine) {
    gameOver()
    return
  }
  // Show the number of adjacent mines
  if (board[row][column].adjacentMines > 0) {
    td.textContent = board[row][column].adjacentMines // Show the count of adjacent mines

    //give each number its unique color
    if (td.textContent === '1') {
      td.style.color = 'blue'
    } else if (td.textContent === '2') {
      td.style.color = 'green'
    } else if (td.textContent === '3') {
      td.style.color = 'red'
    } else if (td.textContent === '4') {
      td.style.color = 'darkblue'
    } else if (td.textContent === '5') {
      td.style.color = '#480303'
    } else if (td.textContent === '6') {
      td.style.color = '#009ba0'
    } else if (td.textContent === '7') {
      td.style.color = 'black'
    } else if (td.textContent === '8') {
      td.style.color = 'gray'
    }
  } else {
    td.textContent = '' // Show nothing if there are no adjacent mines
  }
  td.style.backgroundColor = '#aca9bb'
  td.style.border = 'none'
  // If there are no adjacent mines, reveal adjacent cells
  if (board[row][column].adjacentMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i
        const newCol = column + j
        // Check if the new cell is within the board boundaries
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns) {
          revealCell(newRow, newCol)
        }
      }
    }
  }
  checkWin() //checkWin after each cell reveal
}

//9) Function to put a flag if the cell was right-clicked
const flagCell = (row, column) => {
  const td = document.getElementById(squareId(row, column))
  const cell = board[row][column]

  if (cell.revealed || isGameOver || isWin) {
    return
  }

  cell.flagged = !cell.flagged // Toggle the flagged cell state
  td.classList.toggle('flag')

  if (cell.flagged) {
    flagClick.play() //start the sound effect
    td.textContent = emojis.flag // Show flag emoji
    minesRemain.innerHTML--
  } else {
    td.textContent = '' // Clear the cell
    emojiButton.textContent = emojis.normal //change the emoji back to normal
    minesRemain.innerHTML++
  }
}

//10) Function to check if the player win
const checkWin = () => {
  if (revealedCount === totalCells) {
    //if all the safe cells revealed
    isWin = true
    winAudio.play()
    messageBox.textContent = 'Congratulations, You Win!'
    clearInterval(timer) //stop the stopwatch
    emojiButton.innerHTML = emojis.win

    body.style.backgroundImage = images.underwater.win
  }
}

//11) Function to restart the game
const restartGame = () => {
  clearInterval(timer)
  seconds = 0
  document.querySelector('#stopwatch').textContent = seconds
  revealedCount = 0
  gameStarted = false
  timer = false
  isWin = false
  totalCells = 0
  initiateBoard()
  renderGrid()
  isGameOver = false
  if (isOriginal) {
    body.style.backgroundImage = "url('')"
    body.style.backgroundColor = ''
  } else {
    body.style.backgroundImage = images.underwater.normal
  }

  messageBox.textContent = 'Right Click to Place a Flag.'
  emojiButton.textContent = emojis.normal

  grid.style.fontSize = '1em'
  loseAudio.pause()
  minesRemain.textContent = mines
}

//  Event listeners
//for reset button
document.getElementById('reset-button').addEventListener('click', restartGame)

//For difficulty buttons
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

original.addEventListener('click', () => {
  gameMode.textContent = 'ORIGINAL'
  gameDisplayers.forEach((displayer) => {
    displayer.style.backgroundColor = 'white'
    displayer.style.color = '#13354b'
  })

  body.style.backgroundImage = images.original.normal
  title.style.color = '#d4ede9'
  grid.style.borderColor = '#3a4856'
  navigation.style.color = 'white'
  minesRemain.style.color = '#13354b'
  emojis.mine = emojis.originMine
  minesRemain.style.backgroundColor = 'white'
  isOriginal = true
})

underwater.addEventListener('click', () => {
  gameMode.textContent = 'UNDERWATER'
  body.style.backgroundImage = images.underwater.normal
  title.style.color = ''
  grid.style.borderColor = ''
  navigation.style.color = ''
  minesRemain.style.color = ''
  minesRemain.style.backgroundColor = ''
  emojis.mine = dummyMine
  gameDisplayers.forEach((displayer) => {
    displayer.style.backgroundColor = ''
    displayer.style.color = ''
  })

  isOriginal = false
})

// Start the game for the first time
restartGame()
