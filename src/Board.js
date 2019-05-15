import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of Cells
 *
 **/

class Board extends Component {
    static defaultProps = {
        nrows: 5,
        ncols: 5,
        chanceLightStartsOn: 0.25
    }
    constructor(props) {
        super(props);
        this.state = {
            hasWon: false,
            board: this.createBoard()
        };
    }

    /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

    createBoard() {
        let board = [];
        for(let y = 0; y < this.props.nrows; y++) {
            let row = [];
            for (let x = 0; x < this.props.ncols; x++) {
                row.push(Math.random() < this.props.chanceLightStartsOn);
            }
            board.push(row);
        }
        return board;
    }

    /** handle changing a cell: update board & determine if winner */

    flipCellsAround(coord) {
        let {ncols, nrows} = this.props;
        let board = this.state.board;
        let [y, x] = coord.split("-").map(Number);


        function flipCell(y, x) {
            // if this coord is actually on board, flip it

            if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
                board[y][x] = !board[y][x];
            }
        }

        // flip this cell and the cells around it
        flipCell(y, x); // flip initial cell
        flipCell(y, x - 1); // flip left
        flipCell(y, x + 1); // flip right
        flipCell(y - 1, x); // flip below
        flipCell(y + 1, x); // flip above

        // win when every cell is turned off
        let hasWon = board.every(row => row.every(cell => !cell));

        this.setState({board, hasWon});
    }

    /** Create game board based on board state */
    makeTable() {
        let tblBoard = [];
        for (let y = 0; y < this.props.nrows; y++) {
            let row = [];
            for (let x = 0; x < this.props.ncols; x++) {
                let coord = `${y}-${x}`;
                row.push(
                    <Cell
                        key={coord}
                        isLit={this.state.board[y][x]}
                        flipCellsAroundMe={() => this.flipCellsAround(coord)}
                    />
                );
            }
            tblBoard.push(<tr key={y}>{row}</tr>);
        }
        return (
            <table className='Board'>
                <tbody>{tblBoard}</tbody>
            </table>
        );
    }

    /** Render game board or winning message. */
    render() {
        return (
            <div>
                {this.state.hasWon ? (
                    <div>
                        <span>YOU</span>
                        <span>WIN!</span>
                    </div>
                ) : (
                    <div>
                        <div>
                            <div>Lights</div>
                            <div>Out</div>
                        </div>
                        {this.makeTable()}
                    </div>
                )}
            </div>
        );
    }
}


export default Board;
