// ReplaceSheetContent.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

const ReplaceSheetContent = () => {
  const workbookRef = useRef(null);
  const containerRef = useRef(null);
  const [sheetVersion, setSheetVersion] = useState(0); // Add version tracker
  const [sheets, setSheets] = useState([
    {
      name: "Sheet1",
      celldata: [
        { r: 0, c: 0, v: { v: "Test", m: "Test" } },
        { r: 0, c: 1, v: { v: "Data", m: "Data" } },
        { r: 1, c: 0, v: { v: 100, m: "100", ct: "n" } },
        { r: 1, c: 1, v: { v: 200, m: "200", ct: "n" } },
      ],
      index: 0,
      order: 0,
      config: {},
    },
  ]);

  const handleCellClick = useCallback((e) => {
    if (!workbookRef.current || !containerRef.current) return;
  
    // Get current selection
    const selection = workbookRef.current.getSelection();
    if (selection && selection.length > 0) {
      const { row, column } = selection[0];
      const clickedRow = row[0];
      const clickedCol = column[0];
      
      console.log(`Clicked: row ${clickedRow}, col ${clickedCol}`);
      
      // Simple drill down example
      if (clickedRow === 1 && clickedCol === 0) {
        const newSheets = [
          {
            name: "Drilled",
            celldata: [
              { r: 0, c: 0, v: { v: "Detail A", m: "Detail A" } },
              { r: 0, c: 1, v: { v: "Detail B", m: "Detail B" } },
              { r: 1, c: 0, v: { v: 50, m: "50", ct: "n" } },
              { r: 1, c: 1, v: { v: 50, m: "50", ct: "n" } },
            ],
            index: 0,
            order: 0,
            config: {},
          },
        ];
        console.log("Updating sheets to:", newSheets);
        setSheets(newSheets);
        setSheetVersion(prev => prev + 1); // Force re-render by changing key
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("click", handleCellClick);
    }

    return () => {
      if (container) {
        container.removeEventListener("click", handleCellClick);
      }
    };
  }, [handleCellClick]);

  const handleSheetChange = (updatedSheets) => {
    if (JSON.stringify(updatedSheets) !== JSON.stringify(sheets)) {
      console.log("Workbook data changed:", updatedSheets);
      setSheets(updatedSheets);
    }
  };

  return (
    <div style={{ height: "500px", padding: "20px" }}>
      <h3>Fortune Sheet Test</h3>
      <div
        ref={containerRef}
        style={{ height: "400px", border: "1px solid #ddd" }}
      >
        <Workbook
          key={sheetVersion} // Force remount when version changes
          row={8}
          column={8}
          ref={workbookRef}
          data={sheets}
          onChange={handleSheetChange}
          options={{
            showToolbar: true,
            showGrid: true,
          }}
        />
      </div>
    </div>
  );
};

export default ReplaceSheetContent;