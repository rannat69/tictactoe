import { useState, useEffect, useMemo } from "react";
import "./App.css";

const Grid = () => {
  const [grid, setGrid] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  const [pveOrPvp, setPveOrPvp] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [historyArray, setHistoryArray] = useState([]);

  const storeGameHistory = (grid) => {
    const csvData = window.localStorage.getItem("gameHistory");

    // check if same line already exists in csv
    const line = `${grid.join(", ")}\n`;
    if (csvData && csvData.includes(line)) {
      return;
    }

    if (csvData === null) {
      window.localStorage.setItem("gameHistory", line);
      return;
    } else {
      const newCsvData = `${grid.join(", ")}\n${csvData}`;
      window.localStorage.setItem("gameHistory", newCsvData);
    }
  };

  const handleCellPress = (index) => {
    if (grid[index] || winner || draw) {
      return;
    }

    const newGrid = [...grid];
    newGrid[index] = currentPlayer;

    // if game mode is PvE, player O clicks on a random square, else set currentPlayer to opponent
    if (pveOrPvp === "pve") {
      const emptyCells = newGrid.reduce((acc, cell, index) => {
        if (cell === null) {
          acc.push(index);
        }
        return acc;
      }, []);

      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];

      newGrid[randomCell] = "O";
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }

    window.localStorage.setItem(
      "currentPlayer",
      currentPlayer === "X" ? "O" : "X"
    );

    setGrid(newGrid);
  };

  useEffect(() => {
    // check if grid is empty, if it is,load it from localStorage
    if (grid.every((cell) => cell === null)) {
      const storedGrid = JSON.parse(window.localStorage.getItem("grid"));
      if (storedGrid) {
        setGrid(storedGrid);
        setCurrentPlayer(window.localStorage.getItem("currentPlayer"));
        setPveOrPvp(window.localStorage.getItem("gamemode"));
      }
    } else {
      // store grid in localStorage if not empty
      window.localStorage.setItem("grid", JSON.stringify(grid));
    }
  }, [grid, currentPlayer]);

  useMemo(() => {
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

        // When a winner is found, store the grid and current dateTime in a csv
        // add it to the existing gameHistory if any

        storeGameHistory(grid);

        return grid[a];
      }
    }

    return null;
  }, [grid]);

  useMemo(() => {
    // if all cells filled and no winner, draw game
    if (grid.every((cell) => cell !== null) && !winner) {
      setDraw(true);
      // store the grid and current dateTime in a csv
      storeGameHistory(grid);

      return true;
    } else {
      setDraw(false);
      return false;
    }
  }, [grid, winner]);

  const handleReset = () => {
    // delete grid from local storage
    window.localStorage.removeItem("grid");
    window.localStorage.removeItem("gamemode");
    window.localStorage.removeItem("currentPlayer");

    setGrid(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setDraw(false);
    setPveOrPvp("");
    setShowHistory(false);
  };

  const handlePveOrPvp = (mode) => {
    window.localStorage.setItem("gamemode", mode);
    setPveOrPvp(mode);
  };

  const handleDisplayHistory = () => {
    const history = window.localStorage.getItem("gameHistory");

    // convert history to an array
    const historyArray = history.split("\n").map((line) => line.split(", "));

    //remove last element if empty
    if (historyArray[historyArray.length - 1][0] === "") {
      historyArray.pop();
    }

    setHistoryArray(historyArray);

    setShowHistory(!showHistory);
  };

  return (
    <>
      {pveOrPvp === "" ? (
        <div className="gamemodeContainer">
          <div>Choose game mode:</div>
          <div>
            {" "}
            <button onClick={() => handlePveOrPvp("pve")}>
              Player vs. Computer
            </button>
          </div>
          <div>
            <button onClick={() => handlePveOrPvp("pvp")}>
              Player vs. Player
            </button>
          </div>
        </div>
      ) : (
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
              <div className="winnerMessage" data-testid="winner">
                Player {winner} wins!
              </div>
            )}

            {draw && (
              <div className="drawMessage" data-testid="draw">
                This is a draw!
              </div>
            )}

            {!winner && !draw && (
              <div className="currentPlayer" data-testid="current-player">
                Current Player: {currentPlayer}
              </div>
            )}

            <button onClick={() => handleReset()}>Reset</button>
            <button onClick={() => handleDisplayHistory()}>
              Display history
            </button>

            {showHistory && (
              <div>
                {historyArray.map(
                  (
                    game,
                    index // Use 'game' for each game in historyArray
                  ) => (
                    <div key={index} className="gridContainerHistory">
                      {game.slice(0, 9).map(
                        (
                          item,
                          cellIndex // Slice to get the first 9 elements
                        ) => (
                          <div key={cellIndex} className="cellHistory">
                            {item}
                          </div>
                        )
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Grid;
