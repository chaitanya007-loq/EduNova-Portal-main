import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';
import { Button } from '../common/Button';

export const AlgorithmVisualizer = () => {
  const [array, setArray] = useState([45, 12, 85, 32, 98, 64, 23, 71, 50, 19]);
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [isSorting, setIsSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);

  const generateRandomArray = () => {
    const newArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 85) + 15);
    setArray(newArr);
    setActiveIndices([]);
    setSortedIndices([]);
    setIsSorting(false);
  };

  const runBubbleSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
        }
      }
      setSortedIndices((prev) => [...prev, n - i - 1]);
    }

    setActiveIndices([]);
    setIsSorting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Visualizer Display Box */}
      <div style={{
        height: '300px',
        background: '#050811',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '24px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '12px'
      }}>
        {array.map((val, idx) => {
          const isActive = activeIndices.includes(idx);
          const isSorted = sortedIndices.includes(idx);

          let barColor = 'linear-gradient(180deg, #6366f1, #4f46e5)';
          if (isActive) barColor = 'linear-gradient(180deg, #f43f5e, #e11d48)';
          if (isSorted) barColor = 'linear-gradient(180deg, #10b981, #059669)';

          return (
            <div
              key={idx}
              style={{
                width: '36px',
                height: `${val * 2.5}px`,
                background: barColor,
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '6px',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.8rem',
                transition: 'height 0.2s ease, background 0.2s ease'
              }}
            >
              {val}
            </div>
          );
        })}
      </div>

      {/* Control Panel */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          style={{ width: '200px' }}
          disabled={isSorting}
        >
          <option value="bubbleSort">Bubble Sort Visualizer</option>
          <option value="binarySearch">Binary Search Step Player</option>
          <option value="dfs">Graph DFS Traversal</option>
        </select>

        <Button onClick={runBubbleSort} disabled={isSorting}>
          <Play size={16} /> Run {algorithm === 'bubbleSort' ? 'Bubble Sort' : 'Step Player'}
        </Button>

        <Button variant="outline" onClick={generateRandomArray} disabled={isSorting}>
          <Shuffle size={16} /> Randomize Array
        </Button>
      </div>
    </div>
  );
};
