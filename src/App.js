import { useState, useEffect } from "react";
import styles from "./App.css";

const Grid = () => {
  const [grid, setGrid] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  const handleCellPress = (index) => {
    if (grid[index] || checkWinner() || draw) {
      return;
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

    const newGrid = [...grid];
    newGrid[index] = currentPlayer;
    setGrid(newGrid);
  };

  useEffect(() => {
    // Check for winner or draw after each move

    if (checkWinner() === null) {
      checkDraw();
    }

    // check if grid is empty, if it is,load it from localStorage
    if (grid.every((cell) => cell === null)) {
      const storedGrid = JSON.parse(window.localStorage.getItem("grid"));
      if (storedGrid) {
        setGrid(storedGrid);
      }
    } else {
      // store grid in localStorage if not empty
      window.localStorage.setItem("grid", JSON.stringify(grid));
    }
  }, [grid, currentPlayer]);

  const checkWinner = () => {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
        setWinner(grid[a]);
        return grid[a];
      }
    }

    return null;
  };

  const checkDraw = () => {
    // if all cells filled and no winner, draw game
    if (grid.every((cell) => cell !== null) && !winner) {
      setDraw(true);
      return true;
    } else {
      setDraw(false);
      return false;
    }
  };

  const handleReset = () => {
    // delete grid from local storage
    window.localStorage.removeItem("grid");

    setGrid(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setDraw(false);
  };

  return (
    <>
      <div className="gridContainer">
        {grid.map((cell, index) => (
          <div
            key={index}
            className="cell"
            onClick={() => handleCellPress(index)}
            data-testid={`cell-${index}`}
          >
            {cell}
          </div>
        ))}
      </div>

      <div className="infoContainer">
        {winner && (
          <div className={styles.winnerMessage} data-testid="winner">
            Player {winner} wins!
          </div>
        )}

        {draw && (
          <div className="drawMessage" data-testid="draw">
            It's a draw!
          </div>
        )}

        {!winner && !draw && (
          <div className="currentPlayer" data-testid="current-player">
            Current Player: {currentPlayer}
          </div>
        )}

        <button onClick={() => handleReset()}>Reset</button>
      </div>
    </>
  );
};

export default Grid;
