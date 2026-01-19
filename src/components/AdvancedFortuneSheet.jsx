import React, { useState, useRef, useEffect } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';

const FortuneSheetApp = () => {
  const [sheets, setSheets] = useState([
    {
      name: 'Sheet1',
      celldata: [],
      row: 50,
      column: 26,
      config: {},
      images: []
    }
  ]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [notes, setNotes] = useState({});
  const [sheetNotes, setSheetNotes] = useState('');
  const [selectedCells, setSelectedCells] = useState(null);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showFontPopup, setShowFontPopup] = useState(false);
  const [protectedCells, setProtectedCells] = useState(new Set());
  const workbookRef = useRef(null);
  const fileInputRef = useRef(null);

  // Font options
  const fontFamilies = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Comic Sans MS', 'Impact', 'Tahoma'];
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

  // Apply formatting
  const applyFormatting = (command, value) => {
    const luckysheet = window.luckysheet;
    if (!luckysheet) return;

    switch (command) {
      case 'bold':
        luckysheet.setCellFormat(null, 'bl', value ? 1 : 0);
        break;
      case 'italic':
        luckysheet.setCellFormat(null, 'it', value ? 1 : 0);
        break;
      case 'underline':
        luckysheet.setCellFormat(null, 'un', value ? 1 : 0);
        break;
      case 'alignLeft':
        luckysheet.setCellFormat(null, 'ht', 0);
        break;
      case 'alignCenter':
        luckysheet.setCellFormat(null, 'ht', 1);
        break;
      case 'alignRight':
        luckysheet.setCellFormat(null, 'ht', 2);
        break;
      case 'textColor':
        luckysheet.setCellFormat(null, 'fc', value);
        break;
      case 'bgColor':
        luckysheet.setCellFormat(null, 'bg', value);
        break;
      case 'fontSize':
        luckysheet.setCellFormat(null, 'fs', value);
        break;
      case 'fontFamily':
        luckysheet.setCellFormat(null, 'ff', value);
        break;
    }
  };

  // Row operations
  const insertRows = () => {
    const luckysheet = window.luckysheet;
    if (luckysheet) luckysheet.insertRow();
  };

  const deleteRows = () => {
    const luckysheet = window.luckysheet;
    if (luckysheet) luckysheet.deleteRow();
  };

  const hideRows = () => {
    const luckysheet = window.luckysheet;
    if (luckysheet) luckysheet.hideRow();
  };

  const showRows = () => {
    const luckysheet = window.luckysheet;
    if (luckysheet) luckysheet.showRow();
  };

  // Column operations
  const insertColumns = () => {
    const luckysheet = window.luckysheet;
    if (luckysheet) luckysheet.insertColumn();
  };

  const deleteColumns = () => {
    const luckysheet = window.luckysheet;
    if (luckysheet) luckysheet.deleteColumn();
  };

  const hideColumns = () => {
    const luckysheet = window.luckysheet;
    if (luckysheet) luckysheet.hideColumn();
  };

  const showColumns = () => {
    const luckysheet = window.luckysheet;
    if (luckysheet) luckysheet.showColumn();
  };

  // Merge cells
  const mergeCells = () => {
    const luckysheet = window.luckysheet;
    if (luckysheet) luckysheet.merge();
  };

  const unmergeCells = () => {
    const luckysheet = window.luckysheet;
    if (luckysheet) luckysheet.cancelMerge();
  };

  // Clipboard operations
  const cutContent = () => {
    document.execCommand('cut');
  };

  const copyContent = () => {
    document.execCommand('copy');
  };

  const pasteContent = () => {
    document.execCommand('paste');
  };

  // Find and replace
  const findAndReplace = () => {
    if (!findText) return;
    
    const newSheets = [...sheets];
    const currentSheet = newSheets[activeSheet];
    
    if (currentSheet.celldata) {
      currentSheet.celldata.forEach(cell => {
        if (cell.v && cell.v.v && cell.v.v.toString().includes(findText)) {
          cell.v.v = cell.v.v.toString().replace(new RegExp(findText, 'g'), replaceText);
        }
      });
    }
    
    setSheets(newSheets);
    alert('Find and replace completed!');
  };

  // Add note to cell
  const addCellNote = () => {
    const note = prompt('Enter note for selected cell:');
    if (note && selectedCells) {
      const key = `${activeSheet}-${selectedCells.row}-${selectedCells.col}`;
      setNotes({ ...notes, [key]: note });
      alert('Note added successfully!');
    }
  };

  // AutoSum functions
  const autoSum = (type) => {
    const luckysheet = window.luckysheet;
    if (!luckysheet) return;

    const range = luckysheet.getRange();
    if (!range || range.length === 0) return;

    let values = [];
    range.forEach(cell => {
      if (cell.v && !isNaN(cell.v.v)) {
        values.push(Number(cell.v.v));
      }
    });

    let result;
    switch (type) {
      case 'sum':
        result = values.reduce((a, b) => a + b, 0);
        break;
      case 'average':
        result = values.reduce((a, b) => a + b, 0) / values.length;
        break;
      case 'count':
        result = values.length;
        break;
      case 'max':
        result = Math.max(...values);
        break;
      case 'min':
        result = Math.min(...values);
        break;
      default:
        result = 0;
    }

    alert(`${type.toUpperCase()}: ${result}`);
  };

  // Upload image
  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = {
          src: event.target.result,
          left: 100,
          top: 100,
          width: 200,
          height: 200
        };
        
        const newSheets = [...sheets];
        if (!newSheets[activeSheet].images) {
          newSheets[activeSheet].images = [];
        }
        newSheets[activeSheet].images.push(img);
        setSheets(newSheets);
      };
      reader.readAsDataURL(file);
    }
  };

  // Screenshot
  const takeScreenshot = () => {
    alert('Screenshot feature: Use browser screenshot tools or implement html2canvas library');
  };

  // Export functionality
  const exportAsFile = () => {
    const dataStr = JSON.stringify(sheets);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'spreadsheet.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Create PDF
  const createPDF = () => {
    alert('PDF creation: Integrate jsPDF or similar library for PDF generation');
  };

  // Print
  const printDocument = () => {
    window.print();
  };

  // Protect/Highlight cell
  const toggleCellProtection = () => {
    if (selectedCells) {
      const key = `${activeSheet}-${selectedCells.row}-${selectedCells.col}`;
      const newProtected = new Set(protectedCells);
      if (newProtected.has(key)) {
        newProtected.delete(key);
      } else {
        newProtected.add(key);
      }
      setProtectedCells(newProtected);
      alert('Cell protection toggled!');
    }
  };

  // Wrap text
  const wrapText = () => {
    const luckysheet = window.luckysheet;
    if (luckysheet) {
      luckysheet.setCellFormat(null, 'tb', 2);
    }
  };

  // Borders
  const applyBorder = (type) => {
    const luckysheet = window.luckysheet;
    if (luckysheet) {
      luckysheet.setBorder(type);
    }
  };

  // Decimal places
  const changeDecimalPlaces = (increase) => {
    const luckysheet = window.luckysheet;
    if (luckysheet) {
      const current = luckysheet.getCellFormat();
      const decimals = (current?.ct?.fa || '0').split('.')[1]?.length || 0;
      const newDecimals = increase ? decimals + 1 : Math.max(0, decimals - 1);
      luckysheet.setCellFormat(null, 'ct', { fa: `0.${'0'.repeat(newDecimals)}`, t: 'n' });
    }
  };

  return (
    <div style={styles.container}>
      {/* Top Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarSection}>
          <button onClick={() => applyFormatting('bold', true)} style={styles.button} title="Bold">
            <strong>B</strong>
          </button>
          <button onClick={() => applyFormatting('italic', true)} style={styles.button} title="Italic">
            <em>I</em>
          </button>
          <button onClick={() => applyFormatting('underline', true)} style={styles.button} title="Underline">
            <u>U</u>
          </button>
        </div>

        <div style={styles.toolbarSection}>
          <button onClick={() => applyFormatting('alignLeft')} style={styles.button} title="Align Left">
            ⬅
          </button>
          <button onClick={() => applyFormatting('alignCenter')} style={styles.button} title="Align Center">
            ↔
          </button>
          <button onClick={() => applyFormatting('alignRight')} style={styles.button} title="Align Right">
            ➡
          </button>
        </div>

        <div style={styles.toolbarSection}>
          <input
            type="color"
            onChange={(e) => applyFormatting('textColor', e.target.value)}
            style={styles.colorInput}
            title="Text Color"
          />
          <input
            type="color"
            onChange={(e) => applyFormatting('bgColor', e.target.value)}
            style={styles.colorInput}
            title="Background Color"
          />
        </div>

        <div style={styles.toolbarSection}>
          <button onClick={() => setShowFontPopup(!showFontPopup)} style={styles.button} title="Font Options">
            Font
          </button>
        </div>

        <div style={styles.toolbarSection}>
          <button onClick={mergeCells} style={styles.button} title="Merge Cells">
            Merge
          </button>
          <button onClick={unmergeCells} style={styles.button} title="Unmerge Cells">
            Unmerge
          </button>
        </div>

        <div style={styles.toolbarSection}>
          <button onClick={wrapText} style={styles.button} title="Wrap Text">
            Wrap
          </button>
        </div>

        <div style={styles.toolbarSection}>
          <button onClick={() => changeDecimalPlaces(true)} style={styles.button} title="Increase Decimals">
            .0↑
          </button>
          <button onClick={() => changeDecimalPlaces(false)} style={styles.button} title="Decrease Decimals">
            .0↓
          </button>
        </div>
      </div>

      {/* Second Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarSection}>
          <button onClick={cutContent} style={styles.button} title="Cut">
            Cut
          </button>
          <button onClick={copyContent} style={styles.button} title="Copy">
            Copy
          </button>
          <button onClick={pasteContent} style={styles.button} title="Paste">
            Paste
          </button>
        </div>

        <div style={styles.toolbarSection}>
          <button onClick={insertRows} style={styles.button} title="Insert Row">
            +Row
          </button>
          <button onClick={deleteRows} style={styles.button} title="Delete Row">
            -Row
          </button>
          <button onClick={hideRows} style={styles.button} title="Hide Row">
            Hide Row
          </button>
          <button onClick={showRows} style={styles.button} title="Show Row">
            Show Row
          </button>
        </div>

        <div style={styles.toolbarSection}>
          <button onClick={insertColumns} style={styles.button} title="Insert Column">
            +Col
          </button>
          <button onClick={deleteColumns} style={styles.button} title="Delete Column">
            -Col
          </button>
          <button onClick={hideColumns} style={styles.button} title="Hide Column">
            Hide Col
          </button>
          <button onClick={showColumns} style={styles.button} title="Show Column">
            Show Col
          </button>
        </div>

        <div style={styles.toolbarSection}>
          <button onClick={() => setShowFindReplace(!showFindReplace)} style={styles.button} title="Find & Replace">
            Find
          </button>
        </div>

        <div style={styles.toolbarSection}>
          <button onClick={addCellNote} style={styles.button} title="Add Note">
            Note
          </button>
        </div>
      </div>

      {/* Third Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarSection}>
          <select onChange={(e) => autoSum(e.target.value)} style={styles.select}>
            <option value="">AutoSum</option>
            <option value="sum">Sum</option>
            <option value="average">Average</option>
            <option value="count">Count</option>
            <option value="max">Max</option>
            <option value="min">Min</option>
          </select>
        </div>

        <div style={styles.toolbarSection}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={uploadImage}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button onClick={() => fileInputRef.current.click()} style={styles.button} title="Upload Image">
            Image
          </button>
        </div>

        <div style={styles.toolbarSection}>
          <button onClick={takeScreenshot} style={styles.button} title="Screenshot">
            Screenshot
          </button>
        </div>

        <div style={styles.toolbarSection}>
          <button onClick={toggleCellProtection} style={styles.button} title="Protect Cell">
            Protect
          </button>
        </div>

        <div style={styles.toolbarSection}>
          <select onChange={(e) => applyBorder(e.target.value)} style={styles.select}>
            <option value="">Borders</option>
            <option value="all">All Borders</option>
            <option value="outside">Outside</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="none">No Border</option>
          </select>
        </div>

        <div style={styles.toolbarSection}>
          <button onClick={exportAsFile} style={styles.button} title="Export">
            Export
          </button>
          <button onClick={createPDF} style={styles.button} title="Create PDF">
            PDF
          </button>
          <button onClick={printDocument} style={styles.button} title="Print">
            Print
          </button>
        </div>
      </div>

      {/* Font Popup */}
      {showFontPopup && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h3>Font Options</h3>
            <div style={styles.formGroup}>
              <label>Font Family:</label>
              <select onChange={(e) => applyFormatting('fontFamily', e.target.value)} style={styles.select}>
                {fontFamilies.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Font Size:</label>
              <select onChange={(e) => applyFormatting('fontSize', e.target.value)} style={styles.select}>
                {fontSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setShowFontPopup(false)} style={styles.button}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Find and Replace Dialog */}
      {showFindReplace && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h3>Find and Replace</h3>
            <div style={styles.formGroup}>
              <label>Find:</label>
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Replace:</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={findAndReplace} style={styles.button}>
                Replace All
              </button>
              <button onClick={() => setShowFindReplace(false)} style={styles.button}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workbook */}
      <div style={styles.workbookContainer}>
        <Workbook
          ref={workbookRef}
          data={sheets}
          onChange={setSheets}
          onOp={(op) => {
            console.log('Operation:', op);
          }}
        />
      </div>

      {/* Notes Section */}
      <div style={styles.notesSection}>
        <h3>Sheet Notes</h3>
        <textarea
          value={sheetNotes}
          onChange={(e) => setSheetNotes(e.target.value)}
          style={styles.textarea}
          placeholder="Add notes for this worksheet..."
        />
      </div>

      {/* Status Bar */}
      <div style={styles.statusBar}>
        <span>Active Sheet: {sheets[activeSheet]?.name || 'Sheet1'}</span>
        <span>Ready</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  },
  toolbar: {
    display: 'flex',
    gap: '10px',
    padding: '8px',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc',
    flexWrap: 'wrap',
  },
  toolbarSection: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    borderRight: '1px solid #ddd',
    paddingRight: '10px',
  },
  button: {
    padding: '6px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  colorInput: {
    width: '30px',
    height: '30px',
    border: '1px solid #ccc',
    cursor: 'pointer',
  },
  select: {
    padding: '6px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '12px',
  },
  workbookContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  notesSection: {
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderTop: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    height: '80px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '12px',
    resize: 'vertical',
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 12px',
    backgroundColor: '#f0f0f0',
    borderTop: '1px solid #ccc',
    fontSize: '12px',
  },
  popup: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  popupContent: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    minWidth: '300px',
    maxWidth: '500px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    marginTop: '4px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    marginTop: '16px',
  },
};

export default FortuneSheetApp;