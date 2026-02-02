import React, { useRef, useCallback } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';

function CustomUndoRedoButtons() {
  const workbookRef = useRef(null);

  const handleUndo = useCallback(() => {
    if (workbookRef.current) {
      // Access the handleUndo method from the ref's API
      workbookRef.current.handleUndo();
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (workbookRef.current) {
      // Access the handleRedo method from the ref's API
      workbookRef.current.handleRedo();
    }
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5' }}>
        <button 
          onClick={handleUndo}
          style={{
            padding: '8px 16px',
            marginRight: '8px',
            cursor: 'pointer'
          }}
        >
          ↶ Undo (Ctrl+Z)
        </button>
        <button 
          onClick={handleRedo}
          style={{
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          ↷ Redo (Ctrl+Y)
        </button>
      </div>
      
      <div style={{ width: '100%', height: '600px' }}>
        <Workbook
         row={30}
         column={30}
          ref={workbookRef}
          data={[
            {
              name: 'Sheet1',
              celldata: []
            }
          ]}
          showToolbar={false}  // Hide built-in toolbar since we have custom buttons
        />
      </div>
    </div>
  );
}

export default CustomUndoRedoButtons;