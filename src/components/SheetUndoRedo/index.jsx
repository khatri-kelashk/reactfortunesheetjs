import React, { useRef, useCallback, useEffect, use } from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

function CustomUndoRedoButtons() {
  const workbookRef = useRef(null);

  const handleUndo = useCallback(() => {
    if (workbookRef.current) {
      // Access the handleUndo method from the ref's API
      workbookRef.current.handleUndo();

      console.log("Custom Undo called");
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (workbookRef.current) {
      // Access the handleRedo method from the ref's API
      workbookRef.current.handleRedo();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo: Ctrl+Z (Windows/Linux) or Cmd+Z (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Redo: Ctrl+Y (Windows/Linux) or Cmd+Shift+Z (Mac) or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    // Add event listener to the document or a specific container
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleUndo, handleRedo]);

  useEffect(() => {
    // Focus the workbook on mount to ensure it captures keyboard events
    if (workbookRef.current) {
      console.log("Workbook current", workbookRef.current);
    }
  }, []);

  return (
    <div>
      <div
        style={{ marginBottom: "10px", padding: "10px", background: "#f5f5f5" }}
      >
        <button
          onClick={handleUndo}
          style={{
            padding: "8px 16px",
            marginRight: "8px",
            cursor: "pointer",
          }}
        >
          ↶ Undo (Ctrl+Z)
        </button>
        <button
          onClick={handleRedo}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          ↷ Redo (Ctrl+Y)
        </button>
      </div>

      <div style={{ width: "100%", height: "600px" }}>
        <Workbook
          row={30}
          column={30}
          ref={workbookRef}
          data={[
            {
              name: "Sheet1",
              celldata: [],
            },
          ]}
          showToolbar={false} // Hide built-in toolbar since we have custom buttons
        />
      </div>
    </div>
  );
}

export default CustomUndoRedoButtons;
