const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

enum PlayerEnum {
  Player1 = 'Player1',
  Player2 = 'Player2',
}

type Piece = 'X' | 'O' | '_'

class GameState {
  board: Array<Array<Piece>>
  turn: PlayerEnum
  moves: number
  POSSIBLE_MOVES: Array<string>
  checker: Checker

  constructor() {
    this.board = []
    this.turn = PlayerEnum.Player1
    this.moves = 0
    this.POSSIBLE_MOVES = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']
    this.checker = new Checker()
  }

  public play = async (): Promise<void> => {
    this.initializeBoard()
    this.printBoard()

    while (!this.checker.checkForEnd(this.moves, this.turn, this.board)) {
      this.playerMove(await this.promptPlayer())
      this.printBoard()
      this.changePlayerTurn()
    }

    rl.close()
  }

  private initializeBoard = (): void => {
    const row: Array<Piece> = ['_', '_', '_']
    for (let i = 0; i < 3; i++) {
      this.board.push([...row])
    }
  }

  private playerMove = (coord: string): void => {
    const parsedCoord = this.parseCoord(coord)

    const char = this.turn === PlayerEnum.Player1 ? 'O' : 'X'
    this.board[parsedCoord.rowIndex][parsedCoord.colIndex] = char
    this.moves++
  }

  private promptPlayer = async (): Promise<string> => {
    while (true) {
      const coord = await new Promise<string>((resolve) => {
        rl.question(`Please enter a move, ${this.turn}: `, (userInput: string) => {
          resolve(userInput)
        })
      })

      const parsedCoord = this.parseCoord(coord)
      const legalMove = this.POSSIBLE_MOVES.includes(coord)

      if (!legalMove || !this.ifEmptySquare(parsedCoord))
        console.log('Invalid input. Please try again.')
      else return coord
    }
  }

  private printBoard = (): void => {
    const b = this.board
    console.log('    1   2   3  ')
    console.log('  ╔═══╦═══╦═══╗')
    console.log(`A ║ ${b[0][0]} ║ ${b[0][1]} ║ ${b[0][2]} ║`)
    console.log('  ╟───╫───╫───╢')
    console.log(`B ║ ${b[1][0]} ║ ${b[1][1]} ║ ${b[1][2]} ║`)
    console.log('  ╟───╫───╫───╢')
    console.log(`C ║ ${b[2][0]} ║ ${b[2][1]} ║ ${b[2][2]} ║`)
    console.log('  ╚═══╩═══╩═══╝\n')
  }

  private changePlayerTurn = (): void => {
    if (this.turn === PlayerEnum.Player1) {
      this.turn = PlayerEnum.Player2
    } else {
      this.turn = PlayerEnum.Player1
    }
  }

  private ifEmptySquare = (parsedCoord: { rowIndex: number; colIndex: number }): boolean => {
    return this.board[parsedCoord.rowIndex][parsedCoord.colIndex] === '_'
  }

  private parseCoord = (rawCoord: string): { rowIndex: number; colIndex: number } => {
    const rowIndex = rawCoord.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)
    const colIndex = parseInt(rawCoord[1]) - 1

    return {
      rowIndex: rowIndex,
      colIndex: colIndex,
    }
  }
}

class Checker {
  constructor() {}

  public checkForEnd = (moves: number, turn: PlayerEnum, board: Array<Array<Piece>>): boolean => {
    return (
      this.checkTies(moves) ||
      this.checkRows(board, turn) ||
      this.checkCols(board, turn) ||
      this.checkDiags(board, turn)
    )
  }

  private checkTies = (moves: number): boolean => {
    if (moves === 9) {
      console.log('Tie!')
      return true
    } else {
      return false
    }
  }

  private checkRows = (board: Array<Array<Piece>>, turn: PlayerEnum): boolean => {
    return this.checkLines(board, turn)
  }

  private checkCols = (board: Array<Array<Piece>>, turn: PlayerEnum): boolean => {
    return this.checkLines(this.transpose(board), turn)
  }

  private checkDiags = (board: Array<Array<Piece>>, turn: PlayerEnum): boolean => {
    const lines = [this.findDiagLine(board), this.findDiagLine(this.rotate([...board]))]
    return this.checkLines(lines, turn)
  }

  private checkLines = (board: Array<Array<Piece>>, turn: PlayerEnum): boolean => {
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
        const winningPlayer = turn === PlayerEnum.Player1 ? PlayerEnum.Player2 : PlayerEnum.Player1
        console.log(`${winningPlayer} wins.`)
        return true
      }
    }
    return false
  }

  private findDiagLine = (board: Array<Array<Piece>>): Array<Piece> => {
    const line: Array<Piece> = []

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (r === c) line.push(board[r][c])
      }
    }

    return line
  }

  private transpose = (matrix: Array<Array<Piece>>): Array<Array<Piece>> => {
    return matrix[0].map((col, i) => matrix.map((row) => row[i]))
  }

  private rotate = (matrix: Array<Array<Piece>>): Array<Array<Piece>> => {
    // flip upside down
    const temp = matrix[0]
    matrix[0] = matrix[2]
    matrix[2] = temp

    // transpose
    return this.transpose(matrix)
  }
}

const main = () => {
  const gameState = new GameState()
  gameState.play()
}
main()
