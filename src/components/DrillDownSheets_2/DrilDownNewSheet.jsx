// DrilDownNewSheet.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

const DrilDownNewSheet = () => {
      const navigate = useNavigate();

  const workbookRef = useRef(null);
  const containerRef = useRef(null);
  const [sheetVersion, setSheetVersion] = useState(0);
  const isUpdatingRef = useRef(false); // Flag to prevent onChange conflicts
  
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
      status: 1, // Set as active
    },
  ]);

  const handleCellClick = useCallback((e) => {
    console.log("workbookRef.current", workbookRef.current);
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
        isUpdatingRef.current = true; // Set flag before updating
        
        setSheets(prevSheets => {
          // Get current workbook data to preserve any changes
          let currentSheets = prevSheets;
          if (workbookRef.current && workbookRef.current.getAllSheets) {
            try {
              const allSheets = workbookRef.current.getAllSheets();
              if (allSheets && allSheets.length > 0) {
                currentSheets = allSheets;
              }
            } catch (err) {
              console.log("Could not get all sheets, using state");
            }
          }
          
          // Create new sheet with unique index and order
          const newSheetIndex = currentSheets.length;
          const newSheet = {
            name: `Drilled_${newSheetIndex}`,
            celldata: [
              { r: 0, c: 0, v: { v: "Detail A", m: "Detail A" } },
              { r: 0, c: 1, v: { v: "Detail B", m: "Detail B" } },
              { r: 1, c: 0, v: { v: 50, m: "50", ct: "n" } },
              { r: 1, c: 1, v: { v: 50, m: "50", ct: "n" } },
            ],
            index: newSheetIndex,
            order: newSheetIndex,
            config: {},
            status: 1, // Set as active sheet
          };
          
          // Set all existing sheets to inactive (preserve their data)
          const updatedSheets = currentSheets.map(sheet => ({
            ...sheet,
            status: 0, // Set to inactive
          }));
          
          // Add new sheet to the array
          const newSheets = [...updatedSheets, newSheet];
          console.log("Adding new sheet. Total sheets:", newSheets.length);
          
          setTimeout(() => {
            isUpdatingRef.current = false; // Reset flag after update
          }, 100);
          
          return newSheets;
        });
        setSheetVersion(prev => prev + 1); // Force re-render
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
    // Ignore onChange events when we're programmatically updating
    if (isUpdatingRef.current) {
      console.log("Ignoring onChange during programmatic update");
      return;
    }
    
    if (updatedSheets && JSON.stringify(updatedSheets) !== JSON.stringify(sheets)) {
      console.log("Workbook data changed by user:", updatedSheets.length, "sheets");
      setSheets(updatedSheets);
    }
  };

  const handleNavigateClick = () => {
    navigate("/text-editor"); // navigate to next page
  };

  return (
    <>
    <div style={{ height: "500px", padding: "20px" }}>
      <h3>Fortune Sheet Test - Click on cell B2 (100) to drill down</h3>
      <div
        ref={containerRef}
        style={{ height: "400px", border: "1px solid #ddd" }}
      >
        <Workbook
          key={sheetVersion}
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
    <button onClick={() => {handleNavigateClick()}} style={{border: "1px solid gray", marginLeft: 20}}>Open Terms & Conditions</button>
    </>
  );
};

export default DrilDownNewSheet;