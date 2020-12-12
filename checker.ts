import { Piece, PlayerEnum } from './gameState'

export class Checker {
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
