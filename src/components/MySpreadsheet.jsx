import React, { useRef, useState } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';

const CustomToolbar = ({ sheetRef }) => {
  const [activeSheet, setActiveSheet] = useState(null);

  // Get the FortuneSheet instance
  const getApi = () => {
    return sheetRef.current ? sheetRef.current.getInstance() : null;
  };

  // Bold button handler
  const handleBold = () => {
    const api = getApi();debugger;
    if (api) {
      const range = api.getRange();
      if (range) {
        api.setCellFormat(range, { bl: 1 }); // bl: 1 for bold
      }
    }
  };

  // Italic button handler
  const handleItalic = () => {
    const api = getApi();
    if (api) {
      const range = api.getRange();
      if (range) {
        api.setCellFormat(range, { it: 1 }); // it: 1 for italic
      }
    }
  };

  // Copy handler
  const handleCopy = () => {
    const api = getApi();
    if (api) {
      api.copy();
    }
  };

  // Paste handler
  const handlePaste = () => {
    const api = getApi();
    if (api) {
      api.paste();
    }
  };

  // Format number as currency
  const handleFormatCurrency = () => {
    const api = getApi();
    if (api) {
      const range = api.getRange();
      if (range) {
        api.setCellFormat(range, { 
          format: '"$"#,##0.00' 
        });
      }
    }
  };

  // Clear formatting
  const handleClearFormat = () => {
    const api = getApi();
    if (api) {
      const range = api.getRange();
      if (range) {
        api.setCellFormat(range, { 
          bl: 0, 
          it: 0, 
          ff: null, 
          fs: null,
          fc: null,
          bg: null 
        });
      }
    }
  };

  // Merge cells
  const handleMergeCells = () => {
    const api = getApi();
    if (api) {
      const range = api.getRange();
      if (range && range.length === 1) {
        const { row, column, rowCount, columnCount } = range[0];
        if (rowCount > 1 || columnCount > 1) {
          api.mergeCell(row, column, rowCount, columnCount);
        }
      }
    }
  };

  return (
    <div className="custom-toolbar">
      <div className="toolbar-section">
        <button 
          className="toolbar-btn" 
          onClick={handleBold}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button 
          className="toolbar-btn" 
          onClick={handleItalic}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button 
          className="toolbar-btn" 
          onClick={handleClearFormat}
          title="Clear Formatting"
        >
          Clear Format
        </button>
      </div>

      <div className="toolbar-section">
        <button 
          className="toolbar-btn" 
          onClick={handleCopy}
          title="Copy (Ctrl+C)"
        >
          Copy
        </button>
        <button 
          className="toolbar-btn" 
          onClick={handlePaste}
          title="Paste (Ctrl+V)"
        >
          Paste
        </button>
      </div>

      <div className="toolbar-section">
        <button 
          className="toolbar-btn" 
          onClick={handleFormatCurrency}
          title="Format as Currency"
        >
          $ Currency
        </button>
        <button 
          className="toolbar-btn" 
          onClick={handleMergeCells}
          title="Merge Cells"
        >
          Merge Cells
        </button>
      </div>
    </div>
  );
};

const MySpreadsheet = () => {
  const sheetRef = useRef(null);

  return (
    <div className="spreadsheet-container">
      <CustomToolbar sheetRef={sheetRef} />
      <div className="sheet-wrapper" style={{ height: '600px' }}>
      <Workbook
        ref={sheetRef}
        data={[
          {
            name: 'Sheet1',
            celldata: [],
            order: 0,
            row: 20,
            column: 10,
          },
        ]}
          options={{
            showToolbar: false, // Hide default toolbar
            showGrid: true,
            showBottomBar: true,
          }}
      />
    </div>
    </div>
  );
};

export default MySpreadsheet;