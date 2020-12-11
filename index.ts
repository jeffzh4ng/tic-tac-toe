const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

enum PlayerEnum {
  Player1 = 'Player1',
  Player2 = 'Player2',
}

interface GameState {
  board: Array<Array<string>>
  turn: PlayerEnum
  moves: number
}

const gameState: GameState = {
  board: [],
  turn: PlayerEnum.Player1,
  moves: 0,
}

const initializeBoard = (): void => {
  const row = ['_', '_', '_']
  for (let i = 0; i < 3; i++) {
    gameState.board.push([...row])
  }
}

const printBoard = (): void => {
  for (const row of gameState.board) {
    console.log(row)
  }
}

const POSSIBLE_MOVES = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']
const promptPlayer = async (): Promise<string> => {
  while (true) {
    const coord = await new Promise<string>((resolve) => {
      rl.question(`Please enter a move, ${gameState.turn}`, (userInput: string) => {
        resolve(userInput)
      })
    })

    const parsedCoord = parseCoord(coord)
    const legalMove = POSSIBLE_MOVES.includes(coord)

    if (!legalMove || !ifEmptySquare(parsedCoord)) console.log('Invalid input. Please try again.')
    else return coord
  }
}

const ifEmptySquare = (parsedCoord: { rowIndex: number; colIndex: number }): boolean => {
  return gameState.board[parsedCoord.rowIndex][parsedCoord.colIndex] === '_'
}

const playerMove = (coord: string): void => {
  const parsedCoord = parseCoord(coord)

  const char = gameState.turn === PlayerEnum.Player1 ? 'O' : 'X'
  gameState.board[parsedCoord.rowIndex][parsedCoord.colIndex] = char
  gameState.moves++
}

const parseCoord = (rawCoord: string): { rowIndex: number; colIndex: number } => {
  const rowIndex = rawCoord.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)
  const colIndex = parseInt(rawCoord[1]) - 1

  return {
    rowIndex: rowIndex,
    colIndex: colIndex,
  }
}

const checkForEnd = (): boolean => {
  return checkTies() || checkRows() || checkCols() || checkDiags()
}

const checkTies = (): boolean => {
  if (gameState.moves === 9) {
    console.log('Tie!')
    return true
  } else {
    return false
  }
}

const checkLines = (board: Array<Array<string>>): boolean => {
  for (const row of board) {
    // 1. find first char of row
    const firstChar = row[0]

    let match = true

    for (const char of row) {
      if (char !== firstChar || char === '_') {
        match = false
        break
      }
    }

    if (match) {
      console.log(`${gameState.turn} wins.`)
      return true
    }
  }
  return false
}

const checkRows = (): boolean => {
  return checkLines(gameState.board)
}

const checkCols = (): boolean => {
  return checkLines(transpose(gameState.board))
}

const checkDiags = (): boolean => {
  const lines = [findDiagLine(gameState.board), findDiagLine(transpose(gameState.board))]
  return checkLines(lines)
}

const findDiagLine = (board: Array<Array<string>>): Array<string> => {
  const line = []

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (r === c) line.push(board[r][c])
    }
  }

  return line
}

const transpose = (matrix: Array<Array<string>>): Array<Array<string>> => {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]))
}

const changePlayerTurn = (): void => {
  if (gameState.turn === PlayerEnum.Player1) {
    gameState.turn = PlayerEnum.Player2
  } else {
    gameState.turn = PlayerEnum.Player1
  }
}

const play = async (): Promise<void> => {
  initializeBoard()
  while (!checkForEnd()) {
    playerMove(await promptPlayer())
    printBoard()
    changePlayerTurn()
  }

  rl.close()
}

play()
