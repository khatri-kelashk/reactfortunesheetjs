import React, { useState, useRef, useCallback, useEffect } from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

/**
 * Fortune Sheet Drill-Down Implementation
 * This component demonstrates multiple drill-down patterns:
 * 1. Cell-based drill-down (click to expand details)
 * 2. Row expansion (show/hide child rows)
 * 3. Hierarchical data navigation
 */

const DrillDownFortuneSheet = () => {
  const workbookRef = useRef(null);
  const containerRef = useRef(null);

  // State to manage drill-down levels and expanded rows
  const [drillDownState, setDrillDownState] = useState({
    expandedRows: new Set(),
    currentLevel: 0,
    history: [],
  });

  // Initial sheet data with summary information
  const [sheetData, setSheetData] = useState([
    {
      name: "Sales Summary",
      color: "",
      index: 0,
      status: 1,
      order: 0,
      hide: 0,
      row: 20,
      column: 10,
      celldata: [
        // Header row
        {
          r: 0,
          c: 0,
          v: {
            v: "Region",
            ct: { fa: "General", t: "g" },
            m: "Region",
            bg: "#4472C4",
            fc: "#FFFFFF",
            bl: 1,
          },
        },
        {
          r: 0,
          c: 1,
          v: {
            v: "Total Sales",
            ct: { fa: "General", t: "g" },
            m: "Total Sales",
            bg: "#4472C4",
            fc: "#FFFFFF",
            bl: 1,
          },
        },
        {
          r: 0,
          c: 2,
          v: {
            v: "Status",
            ct: { fa: "General", t: "g" },
            m: "Status",
            bg: "#4472C4",
            fc: "#FFFFFF",
            bl: 1,
          },
        },

        // Data rows with drill-down indicators
        {
          r: 1,
          c: 0,
          v: {
            v: "▶ North",
            ct: { fa: "General", t: "g" },
            m: "▶ North",
            fc: "#0066CC",
            bl: 1,
          },
        },
        {
          r: 1,
          c: 1,
          v: { v: 125000, ct: { fa: "$#,##0.00", t: "n" }, m: "$125,000.00" },
        },
        {
          r: 1,
          c: 2,
          v: {
            v: "Click to expand",
            ct: { fa: "General", t: "g" },
            m: "Click to expand",
            fc: "#666666",
            it: 1,
          },
        },

        {
          r: 2,
          c: 0,
          v: {
            v: "▶ South",
            ct: { fa: "General", t: "g" },
            m: "▶ South",
            fc: "#0066CC",
            bl: 1,
          },
        },
        {
          r: 2,
          c: 1,
          v: { v: 98000, ct: { fa: "$#,##0.00", t: "n" }, m: "$98,000.00" },
        },
        {
          r: 2,
          c: 2,
          v: {
            v: "Click to expand",
            ct: { fa: "General", t: "g" },
            m: "Click to expand",
            fc: "#666666",
            it: 1,
          },
        },

        {
          r: 3,
          c: 0,
          v: {
            v: "▶ East",
            ct: { fa: "General", t: "g" },
            m: "▶ East",
            fc: "#0066CC",
            bl: 1,
          },
        },
        {
          r: 3,
          c: 1,
          v: { v: 156000, ct: { fa: "$#,##0.00", t: "n" }, m: "$156,000.00" },
        },
        {
          r: 3,
          c: 2,
          v: {
            v: "Click to expand",
            ct: { fa: "General", t: "g" },
            m: "Click to expand",
            fc: "#666666",
            it: 1,
          },
        },

        {
          r: 4,
          c: 0,
          v: {
            v: "▶ West",
            ct: { fa: "General", t: "g" },
            m: "▶ West",
            fc: "#0066CC",
            bl: 1,
          },
        },
        {
          r: 4,
          c: 1,
          v: { v: 143000, ct: { fa: "$#,##0.00", t: "n" }, m: "$143,000.00" },
        },
        {
          r: 4,
          c: 2,
          v: {
            v: "Click to expand",
            ct: { fa: "General", t: "g" },
            m: "Click to expand",
            fc: "#666666",
            it: 1,
          },
        },

        // Summary row
        {
          r: 6,
          c: 0,
          v: {
            v: "Total",
            ct: { fa: "General", t: "g" },
            m: "Total",
            bg: "#D9E1F2",
            bl: 1,
          },
        },
        {
          r: 6,
          c: 1,
          v: {
            v: 522000,
            ct: { fa: "$#,##0.00", t: "n" },
            m: "$522,000.00",
            bg: "#D9E1F2",
            bl: 1,
          },
        },
      ],
      config: {
        columnlen: {
          0: 150,
          1: 120,
          2: 150,
        },
      },
    },
  ]);

  // Detailed data for each region (simulating database drill-down)
  const detailedData = {
    North: [
      { store: "Store A", sales: 45000, products: 15 },
      { store: "Store B", sales: 38000, products: 12 },
      { store: "Store C", sales: 42000, products: 14 },
    ],
    South: [
      { store: "Store D", sales: 33000, products: 11 },
      { store: "Store E", sales: 35000, products: 13 },
      { store: "Store F", sales: 30000, products: 10 },
    ],
    East: [
      { store: "Store G", sales: 52000, products: 18 },
      { store: "Store H", sales: 54000, products: 19 },
      { store: "Store I", sales: 50000, products: 17 },
    ],
    West: [
      { store: "Store J", sales: 48000, products: 16 },
      { store: "Store K", sales: 47000, products: 15 },
      { store: "Store L", sales: 48000, products: 16 },
    ],
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (!workbookRef.current || !containerRef.current) return;

      // Get click coordinates relative to the Fortune Sheet container
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Get current selection
      const selection = workbookRef.current.getSelection();

      if (selection && selection.length > 0) {
        const { row, column } = selection[0];
        const clickedRow = row[0];
        const clickedCol = column[0];

        // Check if clicked cell is an action cell (column 2)
        if (clickedCol === 2 && clickedRow > 0) {
          const cellValue = workbookRef.current.getCellValue(
            clickedRow,
            clickedCol,
          );

          if (cellValue && cellValue.includes("Click")) {
            //logic here
            console.log("Cell clicked:", clickedRow, clickedCol);

            // Get current sheet data
            const currentSheet = sheetData[0];
            const cellData = currentSheet.celldata.find(
              (cell) => cell.r === clickedRow && cell.c === clickedCol,
            );

            if (!cellData) return;

            const cellValue = cellData.v?.v || "";

            // Check if it's a region cell (column 0, rows 1-4)
            if (clickedCol === 0 && clickedRow >= 1 && clickedRow <= 4) {
              const region = cellValue
                .replace("▶ ", "")
                .replace("▼ ", "")
                .trim();

              if (drillDownState.expandedRows.has(clickedRow)) {
                // Collapse: remove detail rows
                collapseRegion(clickedRow, region);
              } else {
                // Expand: add detail rows
                expandRegion(clickedRow, region);
              }
            }
          }
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("click", handleClick);
    }

    return () => {
      if (container) {
        container.removeEventListener("click", handleClick);
      }
    };
  }, []);

  // Handle cell click for drill-down
  const handleCellClick = useCallback(
    (row, col) => {
      debugger;
      console.log("Cell clicked:", row, col);

      // Get current sheet data
      const currentSheet = sheetData[0];
      const cellData = currentSheet.celldata.find(
        (cell) => cell.r === row && cell.c === col,
      );

      if (!cellData) return;

      const cellValue = cellData.v?.v || "";

      // Check if it's a region cell (column 0, rows 1-4)
      if (col === 0 && row >= 1 && row <= 4) {
        const region = cellValue.replace("▶ ", "").replace("▼ ", "").trim();

        if (drillDownState.expandedRows.has(row)) {
          // Collapse: remove detail rows
          collapseRegion(row, region);
        } else {
          // Expand: add detail rows
          expandRegion(row, region);
        }
      }
    },
    [sheetData, drillDownState],
  );

  // Expand region to show detailed data
  const expandRegion = (regionRow, regionName) => {
    const details = detailedData[regionName];
    if (!details) return;

    const currentSheet = { ...sheetData[0] };
    const newCellData = [...currentSheet.celldata];

    // Change arrow indicator
    const regionCellIndex = newCellData.findIndex(
      (cell) => cell.r === regionRow && cell.c === 0,
    );
    if (regionCellIndex !== -1) {
      newCellData[regionCellIndex] = {
        ...newCellData[regionCellIndex],
        v: {
          ...newCellData[regionCellIndex].v,
          v: `▼ ${regionName}`,
          m: `▼ ${regionName}`,
        },
      };
    }

    // Insert detail rows below the region row
    let insertRow = regionRow + 1;

    // Shift existing rows down
    newCellData.forEach((cell) => {
      if (cell.r > regionRow) {
        cell.r += details.length;
      }
    });

    // Add detail header
    newCellData.push(
      {
        r: insertRow,
        c: 0,
        v: {
          v: "Store Name",
          ct: { fa: "General", t: "g" },
          m: "Store Name",
          bg: "#E7E6E6",
          fc: "#000000",
          bl: 1,
        },
      },
      {
        r: insertRow,
        c: 1,
        v: {
          v: "Sales",
          ct: { fa: "General", t: "g" },
          m: "Sales",
          bg: "#E7E6E6",
          fc: "#000000",
          bl: 1,
        },
      },
      {
        r: insertRow,
        c: 2,
        v: {
          v: "Products",
          ct: { fa: "General", t: "g" },
          m: "Products",
          bg: "#E7E6E6",
          fc: "#000000",
          bl: 1,
        },
      },
    );
    insertRow++;

    // Add detail rows
    details.forEach((detail) => {
      newCellData.push(
        {
          r: insertRow,
          c: 0,
          v: {
            v: `  ${detail.store}`,
            ct: { fa: "General", t: "g" },
            m: `  ${detail.store}`,
          },
        },
        {
          r: insertRow,
          c: 1,
          v: {
            v: detail.sales,
            ct: { fa: "$#,##0.00", t: "n" },
            m: `$${detail.sales.toLocaleString()}.00`,
          },
        },
        {
          r: insertRow,
          c: 2,
          v: {
            v: detail.products,
            ct: { fa: "General", t: "n" },
            m: detail.products.toString(),
          },
        },
      );
      insertRow++;
    });

    currentSheet.celldata = newCellData;
    setSheetData([currentSheet]);

    // Update expanded state
    setDrillDownState((prev) => ({
      ...prev,
      expandedRows: new Set([...prev.expandedRows, regionRow]),
    }));
  };

  // Collapse region to hide detailed data
  const collapseRegion = (regionRow, regionName) => {
    const details = detailedData[regionName];
    if (!details) return;

    const currentSheet = { ...sheetData[0] };
    let newCellData = [...currentSheet.celldata];

    // Change arrow indicator back
    const regionCellIndex = newCellData.findIndex(
      (cell) => cell.r === regionRow && cell.c === 0,
    );
    if (regionCellIndex !== -1) {
      newCellData[regionCellIndex] = {
        ...newCellData[regionCellIndex],
        v: {
          ...newCellData[regionCellIndex].v,
          v: `▶ ${regionName}`,
          m: `▶ ${regionName}`,
        },
      };
    }

    // Remove detail rows (header + data rows)
    const rowsToRemove = details.length + 1;
    newCellData = newCellData.filter((cell) => {
      return !(cell.r > regionRow && cell.r <= regionRow + rowsToRemove);
    });

    // Shift remaining rows back up
    newCellData.forEach((cell) => {
      if (cell.r > regionRow + rowsToRemove) {
        cell.r -= rowsToRemove;
      }
    });

    currentSheet.celldata = newCellData;
    setSheetData([currentSheet]);

    // Update expanded state
    setDrillDownState((prev) => {
      const newExpanded = new Set(prev.expandedRows);
      newExpanded.delete(regionRow);
      return { ...prev, expandedRows: newExpanded };
    });
  };

  // Reset to original view
  const resetView = () => {
    window.location.reload(); // Simple reset
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>Fortune Sheet - Drill Down Feature</h2>
        <p>
          Click on any region name (▶) to expand and see detailed store
          information
        </p>
        <button
          onClick={resetView}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4472C4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset View
        </button>
      </div>

      <div
        ref={containerRef}
        style={{ height: "600px", border: "1px solid #ddd" }}
      >
        <Workbook
          ref={workbookRef}
          data={sheetData}
          onChange={(data) => {
            // Handle data changes if needed
            console.log("Data changed:", data);
          }}
          onCellClick={(sheet, row, col) => {
            debugger;
            handleCellClick(row, col);
          }}
        />
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <h3>How it works:</h3>
        <ul>
          <li>Click on any region name (▶ North, ▶ South, etc.) to expand</li>
          <li>The arrow changes to ▼ when expanded</li>
          <li>Detail rows appear below the region showing individual stores</li>
          <li>Click again to collapse the details</li>
          <li>Expanded rows: {drillDownState.expandedRows.size}</li>
        </ul>
      </div>
    </div>
  );
};

export default DrillDownFortuneSheet;
