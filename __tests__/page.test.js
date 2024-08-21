import * as React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

import Grid from "../src/app/page";

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

  test("renders initial grid with empty cells", () => {
    render(<Grid />);
    for (let i = 0; i < 9; i++) {
      const cell = screen.getByTestId(`cell-${i}`);
      expect(cell.textContent).toBe("");
    }
  });

  test("handles cell click and updates grid state", () => {
    render(<Grid />);
    const cell = screen.getByTestId(`cell-1`);

    fireEvent.click(cell);
    expect(screen.getByTestId(`cell-1`).textContent).toBe("X");
  });

  test("check for player change after each move", async () => {
    render(<Grid />);

    const cell0 = screen.getByTestId(`cell-0`);
    const cell1 = screen.getByTestId(`cell-1`);
    const resetButton = screen.getByRole("button", { name: /Reset/i });

    await act(() => {
      fireEvent.click(resetButton);
    });

    await act(() => {
      fireEvent.click(cell0);
    });

    expect(screen.getByTestId(`current-player`).textContent).toBe(
      "Current Player: O"
    );
  });

  test("checks for winner after each move", async () => {
    render(<Grid />);

    const resetButton = screen.getByRole("button", { name: /Reset/i });

    const cell0 = screen.getByTestId(`cell-0`);

    const cell1 = screen.getByTestId(`cell-1`);

    console.log("cell1", cell1.textContent);

    const cell2 = screen.getByTestId(`cell-2`);
    const cell3 = screen.getByTestId(`cell-3`);
    const cell4 = screen.getByTestId(`cell-4`);
    const cell5 = screen.getByTestId(`cell-5`);
    const cell6 = screen.getByTestId(`cell-6`);
    // Simulate a winning move (across the top row)
    await act(() => {
      fireEvent.click(resetButton);
    });

    await act(() => {
      fireEvent.click(cell0);
    });
    await act(() => {
      fireEvent.click(cell1);
    });
    await act(() => {
      fireEvent.click(cell2);
    });
    await act(() => {
      fireEvent.click(cell3);
    });
    await act(() => {
      fireEvent.click(cell4);
    });

    await act(() => {
      fireEvent.click(cell5);
    });

    await act(() => {
      fireEvent.click(cell6);
    });

    const winnerElement = screen.getByTestId(`winner`); // Store the element
    expect(winnerElement.textContent).toBe("Player X wins!"); // Compare text content
  });

  test("checks for draw if grid is full and no winner", () => {
    render(<Grid />);
    const resetButton = screen.getByRole("button", { name: /Reset/i });

    // Simulate a draw (fill all cells with alternating X and O)
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
      fireEvent.click(resetButton);
    });
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

  test("resets grid to initial state on reset button click", () => {
    render(<Grid />);
    const resetButton = screen.getByRole("button", { name: /Reset/i });

    const cell0 = screen.getByTestId(`cell-0`);

    act(() => {
      fireEvent.click(cell0);

      fireEvent.click(resetButton);
    });
    //fireEvent.click(resetButton);

    expect(cell0.textContent).toBe("");
  });
  /*
  test("loads grid from localStorage on component mount if grid is empty", () => {
    // Simulate a saved grid in localStorage
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify(["X", null, "O", null, "X", null, null, null, "O"])
    );
    render(<Grid />);
    const cells = screen.getAllByRole("button");
    expect(cells[0].textContent).toBe("X");
    expect(cells[2].textContent).toBe("O");
    expect(cells[4].textContent).toBe("X");
    expect(cells[8].textContent).toBe("O");
  });

  test("saves grid to localStorage after each move", () => {
    render(<Grid />);
    const cell = screen.getByRole("button", { name: "Reset" });
    fireEvent.click(cell);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "grid",
      JSON.stringify(["X", null, null, null, null, null, null, null, null])
    );
  });
  */
});
