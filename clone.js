//constant

const emojis = {
  normal: '😊',
  rightClick: '😮',
  win: '😎',
  lose: '😵',
  flag: '🚩',
  mine: '🦈'
}
//variables
let board = [] //the game grid
let revealedCount = 0 //number of bombs revealed
let timer = false //for the game timer
let seconds = 0 // for the timer
let gameStarted = false // for the startGame function
let totalCells = 0 // the number of cells

//functions
//1) a function that start the game stopwatch
stopwatch = document.querySelector('#stopwatch')
function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      seconds++
      stopwatch.textContent = seconds
    }, 1000)
  }
} //startTimer()

//2) a function that initiate the game board
let rows = 16 // Number of inner arrays
let columns = 16 // Number of elements in each inner array
let mines = 40
const initiateBoard = () => {
  for (let i = 0; i < rows; i++) {
    let innerArray = []
    for (let j = 0; j < columns; j++) {
      innerArray.push(``)
    }
    board.push(innerArray)
  }

  //calculateAdjacents();

  totalCells = rows * columns - mines
  console.log(board)
}
initiateBoard()

//3) a function that generate mines
const placeMines = () => {
  let placedMines = 0
  while (placedMines < 40) {
    const row = Math.floor(Math.random() * board.length)
    const col = Math.floor(Math.random() * board.length)
    if (board[row][col] === '') {
      board[row][col] = emojis.mine
      placedMines++
    }
  }
}
placeMines()

//4) calculate the number of mines surrounding each cell
const calculateAdjacents = () => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      if (board[r][c] === emojis.mine) {
        continue // Skip mine cells
      }
      let count = 0
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (
            r + i >= 0 &&
            r + i < board.length &&
            c + j >= 0 &&
            c + j < board.length &&
            board[r + i][c + j] === emojis.mine
          ) {
            count++
          }
        }
      }
      board[r][c] = count // Set the count of adjacent mines
    }
  }
}
calculateAdjacents()

//5) a function that create unique id for each cell
const squareId = (r, c) => {
  return `cell(${r},${c})`
} //for example squareId(0,0) = cell(0,0)

//6) print the grid on the screen
const printGrid = () => {
  let table, tr, td
  grid.textContent = ''
  table = document.querySelector('#grid')
  for (let r = 0; r < board.length; r++) {
    tr = document.createElement('tr')
    table.appendChild(tr)

    for (let c = 0; c < board.length; c++) {
      td = document.createElement('td') //equal cell

      td.id = squareId(r, c) //sqr id = cell(r,c)
      td.addEventListener('click', () => {
        if (!gameStarted) {
          startTimer()
          gameStarted = true
        }
        redvealeCell(r, c)
      })
      td.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        flagCell(r, c)
      })
      td.textContent = board[r][c]
      tr.appendChild(td)
    }
  }
}
printGrid()

let messageBox = document.querySelector('#message')
//7) a function that redveale the cell when player click, or loose
const redvealeCell = (row, column) => {
  //if the cell was revealed before, or flagged, then return from the function
  if (board[row][column].revealed || board[row][column].flagged) {
    return
  }
  board[row][column].revealed = true
  redvealeCell++

  const td = document.querySelector(`#cell(${row},${column})`)

  td.classList.add('revealed')

  if (board[row][column] === emojis.mine) {
    td.classList.add('mine')
    messageBox.textContent = 'Game Over! You hit a Shark!.'
    clearInterval(seconds)
    return
  }
}

//8) a function that put a flag is the cell was rightClicked
const flagCell = (row, column) => {
  const cell = document.querySelector(`#cell(${row},${column})`)
  board[row][column].flagged = !board[row][column.flagged]
  cell.classList.toggle('flag')
  cell.textContent = emojis.flag
}

//9) a function that check winning condition
const checkWin = () => {
  if (revealedCount === totalCells) {
    messageBox.textContent = 'Congratulation, You Win!'
    clearInterval(seconds)
  }
}

//10) a  function that restart the game
const restartGame = () => {
  clearInterval(startTimer)
  seconds = 0
  document.querySelector('#stopwatch').textContent = seconds
  revealedCount = 0
  gameStarted = false
  let timer = false //for the game timer
  let totalCells = 0 // the number of cells
  initiateBoard()
  printGrid()
}
