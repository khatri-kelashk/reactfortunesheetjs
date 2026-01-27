import React, { useState, useRef, useEffect } from "react";
import {Workbook} from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

function FortuneSheetWithClickableCells() {
  const workbookRef = useRef(null);
  const containerRef = useRef(null);
  
  const [data, setData] = useState([
    {
      name: "Sheet1",
      celldata: [
        { r: 0, c: 0, v: { v: "Name", m: "Name" } },
        { r: 0, c: 1, v: { v: "Email", m: "Email" } },
        { r: 0, c: 2, v: { v: "Action", m: "Action" } },
        { r: 1, c: 0, v: { v: "John Doe", m: "John Doe" } },
        { r: 1, c: 1, v: { v: "john@example.com", m: "john@example.com" } },
        { 
          r: 1, 
          c: 2, 
          v: { 
            v: "🔵 Click", 
            m: "🔵 Click",
            bg: "#e3f2fd",
            fc: "#1976d2"
          } 
        },
        { r: 2, c: 0, v: { v: "Jane Smith", m: "Jane Smith" } },
        { r: 2, c: 1, v: { v: "jane@example.com", m: "jane@example.com" } },
        { 
          r: 2, 
          c: 2, 
          v: { 
            v: "🔵 Click", 
            m: "🔵 Click",
            bg: "#e3f2fd",
            fc: "#1976d2"
          } 
        },
      ],
    },
  ]);

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
          const cellValue = workbookRef.current.getCellValue(clickedRow, clickedCol);
          
          if (cellValue && cellValue.includes("Click")) {
            handleApiCall(clickedRow, clickedCol);
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

  const handleApiCall = async (row, col) => {
    if (!workbookRef.current) return;

    const sheet = workbookRef.current.getSheet();
    
    // Collect row data
    const rowData = {};
    sheet.celldata.forEach((cell) => {
      if (cell.r === row) {
        rowData[`col_${cell.c}`] = cell.v?.v;
      }
    });

    console.log("Executing API for row:", row, rowData);

    // Update cell to show loading
    workbookRef.current.setCellValue(row, col, "⏳ Loading...");

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, data: rowData }),
      });

      const result = await response.json();
      console.log("API Response:", result);

      // Update cell to show success
      workbookRef.current.setCellValue(row, col, "✅ Done");
      
      setTimeout(() => {
        workbookRef.current.setCellValue(row, col, "🔵 Click");
        console.log(
        "workbookRef?.current?.getSheet()",
        workbookRef?.current?.getSheet()
      );
      }, 2000);

    } catch (error) {
      console.error("API Error:", error);
      workbookRef.current.setCellValue(row, col, "❌ Failed");
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{ width: "100%", height: "600px" }}
    >
      <Workbook
        ref={workbookRef}
        data={data}
        onChange={setData}
      />
    </div>
  );
}

export default FortuneSheetWithClickableCells;