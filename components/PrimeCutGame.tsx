'use client'
import React, { useEffect, useState } from 'react';

type Cell = {
  row: number;
  col: number;
  value: number;
};

export default function PrimeCutGame() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Fetch daily grid from backend
  useEffect(() => {
    fetch('/api/daily-grid')
      .then((res) => res.json())
      .then((data) => setGrid(data.grid))
      .catch(() => alert('Failed to load daily grid'));
  }, []);

  const toggleCell = (row: number, col: number) => {
    const index = selectedCells.findIndex(
      (c) => c.row === row && c.col === col
    );
    if (index >= 0) {
      // Deselect cell
      setSelectedCells((cells) =>
        cells.filter((_, i) => i !== index)
      );
    } else {
      // Select cell (add if adjacent or first)
      if (
        selectedCells.length === 0 ||
        selectedCells.some((c) =>
          isAdjacent(c, { row, col, value: grid[row][col] })
        )
      ) {
        setSelectedCells((cells) => [...cells, { row, col, value: grid[row][col] }]);
      } else {
        alert('Cells must be adjacent to selected group');
      }
    }
  };

  // Check adjacency (orthogonal only)
  const isAdjacent = (c1: Cell, c2: Cell) => {
    return (
      (c1.row === c2.row && Math.abs(c1.col - c2.col) === 1) ||
      (c1.col === c2.col && Math.abs(c1.row - c2.row) === 1)
    );
  };

  // Submit current group (for now just log)
  const submitGroup = () => {
    if (selectedCells.length === 0) {
      alert('Select some cells first');
      return;
    }
    const coords = selectedCells.map((c) => [c.row, c.col]);
    console.log('Submitted group:', coords);
    alert(`Group submitted! Cells: ${coords.map(c => `(${c[0]},${c[1]})`).join(', ')}`);
    setSelectedCells([]);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', userSelect: 'none' }}>
      <h2>Prime Cut Daily Puzzle</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grid.length}, 40px)`,
          gap: 4,
        }}
        onMouseLeave={() => setIsMouseDown(false)}
      >
        {grid.flatMap((row, r) =>
          row.map((value, c) => {
            const isSelected = selectedCells.some(
              (cell) => cell.row === r && cell.col === c
            );
            return (
              <div
                key={`${r}-${c}`}
                onMouseDown={() => {
                  setIsMouseDown(true);
                  toggleCell(r, c);
                }}
                onMouseEnter={() => {
                  if (isMouseDown) {
                    toggleCell(r, c);
                  }
                }}
                onMouseUp={() => setIsMouseDown(false)}
                style={{
                  width: 40,
                  height: 40,
                  lineHeight: '40px',
                  textAlign: 'center',
                  border: '1px solid #333',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#90cdf4' : '#eee',
                  userSelect: 'none',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}
              >
                {value}
              </div>
            );
          })
        )}
      </div>
      <button
        onClick={submitGroup}
        style={{ marginTop: 20, padding: '10px 20px', fontSize: 16 }}
      >
        Submit Group
      </button>
      <p style={{ marginTop: 10 }}>
        Select adjacent cells by clicking or dragging. Submit your group.
      </p>
    </div>
  );
}
