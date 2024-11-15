// Defining constant variables
const emojis = {
  normal: '😊',
  rightClick: '😮',
  win: '😎',
  lose: '😵',
  flag: '🚩',
  mine: '💣'
}

//elements references
//1) have the mine remain
let leftSideBox = document.querySelector('#left-side-box')

//2) have the stopwatch
let rightSideBox = document.querySelector('#right-side-box')

//3) have the emoji and reset button

let emojiButton = document.querySelector('#reset-button')

//4) have the div that will contain the whole grid
let gameGrid = document.querySelector('#grid')

//5) have the beginner link
beginner = document.querySelector('#beginner')
//6) have the intermediate link
intermediate = document.querySelector('#intermediate')
//7) have the advanced link
advance = document.querySelector('#advance')

//variables
let gridSettings = {
  totalRows: 9,
  totalColumns: 9,
  totalMines: 10
}

let seconds = 0
let timer = false

// game initalizing variables
let gameStart = false
let gameEnd = false

// setting the grid

// functions
//1) a function that start the timer
const startStopwatch = () => {
  if (!timer) {
    timer = setInterval(() => {
      seconds++
      leftSideBox.textContent = seconds
    }, 1000)
  }
} //startStopwatch()

//2) a function that create a unique id for each square.
const squareId = (i, j) => {
  return `cell(${i},${j})`
} //for example squareId(0,0) = cell(0,0)

// an array that have all the grid values
let squaresArray = []
//3) a function that generate the grid
const renderGrid = (totalRows, totalColumns) => {
  let table, tr, td
  gameGrid.innerHTML = ''

  table = document.createElement('table')
  gameGrid.appendChild(table)
  for (let i = 0; i < gridSettings.totalRows; i++) {
    tr = document.createElement('tr')
    table.appendChild(tr)
    squaresArray[i] = []
    for (let j = 0; j < gridSettings.totalColumns; j++) {
      td = document.createElement('td')
      td.textContent = '0'
      tr.appendChild(td)
      td.id = squareId(i, j)
      td.classList.add('column') //give each grid square a class named square.
      tr.classList.add('row')
      squaresArray[i].push(td.innerHTML)
    }
  }
} //return a grid when clicked, look at the event listener
