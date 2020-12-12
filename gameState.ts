import { Checker } from './checker'

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

export enum PlayerEnum {
  Player1 = 'Player1',
  Player2 = 'Player2',
}

export type Piece = 'X' | 'O' | '_'

export class GameState {
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
