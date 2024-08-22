import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { act } from "react";

import Grid from "./App";

// Mock localStorage to avoid actual storage interaction during tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

window.localStorage = localStorageMock;

describe("Grid Component", () => {
  beforeEach(() => {
    // Reset localStorage mock before each test
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test("start with pve and pvp buttons", () => {
    render(<Grid />);

    expect(screen.getByText(/Player vs. Computer/i)).toBeInTheDocument();
    expect(screen.getByText(/Player vs. Player/i)).toBeInTheDocument();
  });

  test("renders initial grid with empty cells after choosing game mode", async () => {
    render(<Grid />);

    const pvpButton = screen.getByRole("button", {
      name: /Player vs. Player/i,
    });
    await act(() => {
      fireEvent.click(pvpButton);
    });

    for (let i = 0; i < 9; i++) {
      const cell = screen.getByTestId(`cell-${i}`);
      expect(cell.textContent).toBe("");
    }
  });

  test("handles cell click and updates grid state", async () => {
    render(<Grid />);

    const pvpButton = screen.getByRole("button", {
      name: /Player vs. Player/i,
    });
    await act(() => {
      fireEvent.click(pvpButton);
    });

    const cell = screen.getByTestId(`cell-1`);

    fireEvent.click(cell);
    expect(screen.getByTestId(`cell-1`).textContent).toBe("X");
  });

  test("check for player change after each move", () => {
    render(<Grid />);

    const resetButton = screen.getByRole("button", { name: /Reset/i });

    act(() => {
      fireEvent.click(resetButton);
    });

    const pvpButton = screen.getByRole("button", {
      name: /Player vs. Player/i,
    });

    act(() => {
      fireEvent.click(pvpButton);
    });

    const cell0 = screen.getByTestId(`cell-0`);

    act(() => {
      fireEvent.click(cell0);
    });

    expect(screen.getByTestId(`current-player`).textContent).toBe(
      "Current Player: O"
    );
  });

  test("checks for winner after each move", () => {
    render(<Grid />);

    const resetButton = screen.getByRole("button", { name: /Reset/i });

    // Simulate a winning move (across the top row)
    act(() => {
      fireEvent.click(resetButton);
    });

    const pvpButton = screen.getByRole("button", {
      name: /Player vs. Player/i,
    });

    act(() => {
      fireEvent.click(pvpButton);
    });

    const cell0 = screen.getByTestId(`cell-0`);

    const cell1 = screen.getByTestId(`cell-1`);

    const cell2 = screen.getByTestId(`cell-2`);
    const cell3 = screen.getByTestId(`cell-3`);
    const cell4 = screen.getByTestId(`cell-4`);
    const cell5 = screen.getByTestId(`cell-5`);
    const cell6 = screen.getByTestId(`cell-6`);
    act(() => {
      fireEvent.click(cell0);
    });
    act(() => {
      fireEvent.click(cell1);
    });
    act(() => {
      fireEvent.click(cell2);
    });
    act(() => {
      fireEvent.click(cell3);
    });
    act(() => {
      fireEvent.click(cell4);
    });

    act(() => {
      fireEvent.click(cell5);
    });

    act(() => {
      fireEvent.click(cell6);
    });

    const winnerElement = screen.getByTestId(`winner`); // Store the element
    expect(winnerElement.textContent).toBe("Player X wins!"); // Compare text content
  });

  test("checks for draw if grid is full and no winner", () => {
    render(<Grid />);
    const resetButton = screen.getByRole("button", { name: /Reset/i });

    // Simulate a draw (fill all cells with alternating X and O)

    act(() => {
      fireEvent.click(resetButton);
    });

    const pvpButton = screen.getByRole("button", {
      name: /Player vs. Player/i,
    });

    act(() => {
      fireEvent.click(pvpButton);
    });

    const cell0 = screen.getByTestId(`cell-0`);
    const cell1 = screen.getByTestId(`cell-1`);
    const cell2 = screen.getByTestId(`cell-2`);
    const cell3 = screen.getByTestId(`cell-3`);
    const cell4 = screen.getByTestId(`cell-4`);
    const cell5 = screen.getByTestId(`cell-5`);
    const cell6 = screen.getByTestId(`cell-6`);
    const cell7 = screen.getByTestId(`cell-7`);
    const cell8 = screen.getByTestId(`cell-8`);

    act(() => {
      fireEvent.click(cell4);
    });
    act(() => {
      fireEvent.click(cell0);
    });
    act(() => {
      fireEvent.click(cell8);
    });
    act(() => {
      fireEvent.click(cell2);
    });
    act(() => {
      fireEvent.click(cell1);
    });
    act(() => {
      fireEvent.click(cell7);
    });
    act(() => {
      fireEvent.click(cell3);
    });
    act(() => {
      fireEvent.click(cell5);
    });
    act(() => {
      fireEvent.click(cell6);
    });

    const winnerElement = screen.getByTestId(`draw`);
    expect(winnerElement.textContent).toBe("This is a draw!");
  });

  test("resets grid to game selection on reset button click", () => {
    render(<Grid />);
    const resetButton = screen.getByRole("button", { name: /Reset/i });

    act(() => {
      fireEvent.click(resetButton);
    });

    expect(screen.getByText(/Player vs. Computer/i)).toBeInTheDocument();
    expect(screen.getByText(/Player vs. Player/i)).toBeInTheDocument();
  });

  test("loads grid from localStorage on component mount if grid is empty", () => {
    render(<Grid />);

    const pvpButton = screen.getByRole("button", {
      name: /Player vs. Player/i,
    });

    act(() => {
      fireEvent.click(pvpButton);
    });

    render(<Grid />);

    waitFor(() => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(["X", null, "O", null, "X", null, null, null, "O"])
      );

      const cell0 = screen.getByTestId(`cell-0`);
      const cell1 = screen.getByTestId(`cell-1`);
      const cell2 = screen.getByTestId(`cell-2`);
      const cell3 = screen.getByTestId(`cell-3`);
      const cell4 = screen.getByTestId(`cell-4`);
      const cell5 = screen.getByTestId(`cell-5`);
      const cell6 = screen.getByTestId(`cell-6`);
      const cell7 = screen.getByTestId(`cell-7`);
      const cell8 = screen.getByTestId(`cell-8`);

      expect(cell0.textContent).toBe("X");
      expect(cell2.textContent).toBe("O");
      expect(cell4.textContent).toBe("X");
      expect(cell8.textContent).toBe("O");
    });
  });

  test("saves grid to localStorage after each move", () => {
    render(<Grid />);

    const pvpButton = screen.getByRole("button", {
      name: /Player vs. Player/i,
    });

    act(() => {
      fireEvent.click(pvpButton);
    });

    const cell0 = screen.getByTestId(`cell-0`);

    act(() => {
      fireEvent.click(cell0);
    });

    waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "grid",
        JSON.stringify(["X", null, null, null, null, null, null, null, null])
      );
    });
  });
});
