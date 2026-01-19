import React, { useState, useRef, useEffect } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';

const FortuneSheetApp = () => {
  const workbookRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showFontPopup, setShowFontPopup] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [sheetNotes, setSheetNotes] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedSize, setSelectedSize] = useState(11);

  const fontFamilies = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Comic Sans MS', 'Impact', 'Tahoma', 'Calibri'];
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

  // Get luckysheet instance
  const getLuckysheet = () => {
    return window.luckysheet;
  };

  // Text formatting
  const setBold = () => {
    const luckysheet = getLuckysheet();debugger;
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        const isBold = range[0]?.v?.bl === 1;
        luckysheet.setCellValue(range[0].r, range[0].c, range[0].r, range[0].c, { bl: isBold ? 0 : 1 });
      }
    }
  };

  const setItalic = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        const isItalic = range[0]?.v?.it === 1;
        luckysheet.setCellValue(range[0].r, range[0].c, range[0].r, range[0].c, { it: isItalic ? 0 : 1 });
      }
    }
  };

  const setUnderline = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        const isUnderline = range[0]?.v?.un === 1;
        luckysheet.setCellValue(range[0].r, range[0].c, range[0].r, range[0].c, { un: isUnderline ? 0 : 1 });
      }
    }
  };

  // Alignment
  const setAlignment = (type) => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const alignMap = { left: 0, center: 1, right: 2 };
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        range.forEach(cell => {
          luckysheet.setCellValue(cell.r, cell.c, cell.r, cell.c, { ht: alignMap[type] });
        });
      }
    }
  };

  const setVerticalAlignment = (type) => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const alignMap = { top: 0, middle: 1, bottom: 2 };
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        range.forEach(cell => {
          luckysheet.setCellValue(cell.r, cell.c, cell.r, cell.c, { vt: alignMap[type] });
        });
      }
    }
  };

  // Colors
  const setTextColor = (color) => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        range.forEach(cell => {
          luckysheet.setCellValue(cell.r, cell.c, cell.r, cell.c, { fc: color });
        });
      }
    }
  };

  const setBackgroundColor = (color) => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        range.forEach(cell => {
          luckysheet.setCellValue(cell.r, cell.c, cell.r, cell.c, { bg: color });
        });
      }
    }
  };

  // Font
  const applyFont = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        range.forEach(cell => {
          luckysheet.setCellValue(cell.r, cell.c, cell.r, cell.c, { 
            ff: selectedFont,
            fs: selectedSize 
          });
        });
      }
    }
    setShowFontPopup(false);
  };

  // Merge cells
  const mergeCells = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const selection = luckysheet.getRange();
      if (selection && selection.length > 1) {
        const rowStart = Math.min(...selection.map(s => s.r));
        const rowEnd = Math.max(...selection.map(s => s.r));
        const colStart = Math.min(...selection.map(s => s.c));
        const colEnd = Math.max(...selection.map(s => s.c));
        
        luckysheet.setRangeShow({ 
          row: [rowStart, rowEnd], 
          column: [colStart, colEnd] 
        });
        luckysheet.setRangeMerge('all');
      }
    }
  };

  const unmergeCells = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      luckysheet.setRangeMerge('cancel');
    }
  };

  // Borders
  const setBorder = (type) => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const borderStyle = {
        style: 'thin',
        color: '#000000'
      };
      
      luckysheet.setRangeBorder(type, borderStyle);
    }
  };

  // Wrap text
  const toggleWrapText = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        const isWrapped = range[0]?.v?.tb === 2;
        range.forEach(cell => {
          luckysheet.setCellValue(cell.r, cell.c, cell.r, cell.c, { tb: isWrapped ? 0 : 2 });
        });
      }
    }
  };

  // Decimal places
  const changeDecimal = (increase) => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        range.forEach(cell => {
          if (cell.v && typeof cell.v.v === 'number') {
            const currentDecimals = (cell.v.ct?.fa || '').split('.')[1]?.length || 0;
            const newDecimals = increase ? currentDecimals + 1 : Math.max(0, currentDecimals - 1);
            luckysheet.setCellValue(cell.r, cell.c, cell.r, cell.c, {
              ct: { fa: `0.${'0'.repeat(newDecimals)}`, t: 'n' }
            });
          }
        });
      }
    }
  };

  // Row operations
  const insertRow = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        luckysheet.insertRow(range[0].r);
      }
    }
  };

  const deleteRow = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        luckysheet.deleteRow(range[0].r, range[0].r);
      }
    }
  };

  const hideRow = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        luckysheet.hideRow(range[0].r, range[0].r);
      }
    }
  };

  const showRow = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        luckysheet.showRow(range[0].r, range[0].r);
      }
    }
  };

  // Column operations
  const insertColumn = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        luckysheet.insertColumn(range[0].c);
      }
    }
  };

  const deleteColumn = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        luckysheet.deleteColumn(range[0].c, range[0].c);
      }
    }
  };

  const hideColumn = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        luckysheet.hideColumn(range[0].c, range[0].c);
      }
    }
  };

  const showColumn = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        luckysheet.showColumn(range[0].c, range[0].c);
      }
    }
  };

  // Clipboard
  const cutCells = () => {
    document.execCommand('cut');
  };

  const copyCells = () => {
    document.execCommand('copy');
  };

  const pasteCells = () => {
    document.execCommand('paste');
  };

  // Find and Replace
  const performFindReplace = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet && findText) {
      const data = luckysheet.getSheetData();
      let replaced = 0;
      
      data.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell && cell.v && typeof cell.v === 'string' && cell.v.includes(findText)) {
            const newValue = cell.v.replace(new RegExp(findText, 'g'), replaceText);
            luckysheet.setCellValue(r, c, r, c, { v: newValue });
            replaced++;
          }
        });
      });
      
      alert(`Replaced ${replaced} occurrences`);
      setShowFindReplace(false);
    }
  };

  // Add cell note
  const addCellNote = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        setShowNoteDialog(true);
      } else {
        alert('Please select a cell first');
      }
    }
  };

  const saveCellNote = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet && noteText) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        luckysheet.setCellValue(range[0].r, range[0].c, range[0].r, range[0].c, {
          ps: { value: noteText, isShow: true }
        });
      }
    }
    setNoteText('');
    setShowNoteDialog(false);
  };

  // AutoSum
  const calculateAutoSum = (type) => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        const values = range
          .filter(cell => cell.v && !isNaN(cell.v.v))
          .map(cell => Number(cell.v.v));
        
        let result = 0;
        switch(type) {
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
        }
        
        alert(`${type.toUpperCase()}: ${result.toFixed(2)}`);
      }
    }
  };

  // Upload image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const luckysheet = getLuckysheet();
        if (luckysheet) {
          const imgData = {
            src: event.target.result,
            originWidth: 200,
            originHeight: 200,
            default: {
              width: 200,
              height: 200,
              left: 100,
              top: 100
            },
            crop: {
              width: 200,
              height: 200,
              offsetLeft: 0,
              offsetTop: 0
            },
            isFixedPos: false,
            fixedLeft: 0,
            fixedTop: 0,
            border: {
              width: 0,
              radius: 0,
              style: 'solid',
              color: '#000'
            }
          };
          
          luckysheet.insertImage(imgData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Export
  const exportFile = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const data = luckysheet.getAllSheets();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'spreadsheet-export.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Print
  const printSheet = () => {
    window.print();
  };

  // Screenshot
  const takeScreenshot = () => {
    alert('For screenshot: Use browser tools (Ctrl+Shift+S in Firefox/Chrome) or install html2canvas package');
  };

  // Create PDF
  const createPDF = () => {
    alert('For PDF: Install jsPDF package\nnpm install jspdf jspdf-autotable');
  };

  // Clear formatting
  const clearFormatting = () => {
    const luckysheet = getLuckysheet();
    if (luckysheet) {
      const range = luckysheet.getRange();
      if (range && range.length > 0) {
        range.forEach(cell => {
          luckysheet.setCellValue(cell.r, cell.c, cell.r, cell.c, {
            bl: 0, it: 0, un: 0, fc: '#000000', bg: null, ff: 'Arial', fs: 11
          });
        });
      }
    }
  };

  const data = [
    {
      name: 'Sheet1',
      config: {},
      celldata: [
        { r: 0, c: 0, v: { v: 'Sample', m: 'Sample', ct: { fa: 'General', t: 'g' } } },
        { r: 0, c: 1, v: { v: 'Data', m: 'Data', ct: { fa: 'General', t: 'g' } } },
      ],
    },
  ];

  return (
    <div style={styles.container}>
      {/* Toolbar 1: Text Formatting */}
      <div style={styles.toolbar}>
        <button onClick={setBold} style={styles.btn} title="Bold (Ctrl+B)">
          <strong>B</strong>
        </button>
        <button onClick={setItalic} style={styles.btn} title="Italic (Ctrl+I)">
          <em>I</em>
        </button>
        <button onClick={setUnderline} style={styles.btn} title="Underline (Ctrl+U)">
          <u>U</u>
        </button>
        
        <div style={styles.divider}></div>
        
        <button onClick={() => setAlignment('left')} style={styles.btn} title="Align Left">⬅</button>
        <button onClick={() => setAlignment('center')} style={styles.btn} title="Align Center">↔</button>
        <button onClick={() => setAlignment('right')} style={styles.btn} title="Align Right">➡</button>
        
        <div style={styles.divider}></div>
        
        <label style={styles.colorLabel}>
          <input type="color" onChange={(e) => setTextColor(e.target.value)} style={styles.colorInput} />
          <span>Text</span>
        </label>
        <label style={styles.colorLabel}>
          <input type="color" onChange={(e) => setBackgroundColor(e.target.value)} style={styles.colorInput} />
          <span>Fill</span>
        </label>
        
        <div style={styles.divider}></div>
        
        <button onClick={() => setShowFontPopup(true)} style={styles.btn}>Font</button>
        <button onClick={clearFormatting} style={styles.btn} title="Clear Formatting">Clear</button>
      </div>

      {/* Toolbar 2: Cell Operations */}
      <div style={styles.toolbar}>
        <button onClick={cutCells} style={styles.btn}>Cut</button>
        <button onClick={copyCells} style={styles.btn}>Copy</button>
        <button onClick={pasteCells} style={styles.btn}>Paste</button>
        
        <div style={styles.divider}></div>
        
        <button onClick={mergeCells} style={styles.btn}>Merge</button>
        <button onClick={unmergeCells} style={styles.btn}>Unmerge</button>
        
        <div style={styles.divider}></div>
        
        <button onClick={toggleWrapText} style={styles.btn}>Wrap</button>
        
        <div style={styles.divider}></div>
        
        <select onChange={(e) => setBorder(e.target.value)} style={styles.select}>
          <option value="">Borders</option>
          <option value="all">All</option>
          <option value="outside">Outside</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="none">None</option>
        </select>
        
        <div style={styles.divider}></div>
        
        <button onClick={() => changeDecimal(true)} style={styles.btn}>.0↑</button>
        <button onClick={() => changeDecimal(false)} style={styles.btn}>.0↓</button>
      </div>

      {/* Toolbar 3: Row/Column */}
      <div style={styles.toolbar}>
        <button onClick={insertRow} style={styles.btn}>+ Row</button>
        <button onClick={deleteRow} style={styles.btn}>- Row</button>
        <button onClick={hideRow} style={styles.btn}>Hide Row</button>
        <button onClick={showRow} style={styles.btn}>Show Row</button>
        
        <div style={styles.divider}></div>
        
        <button onClick={insertColumn} style={styles.btn}>+ Col</button>
        <button onClick={deleteColumn} style={styles.btn}>- Col</button>
        <button onClick={hideColumn} style={styles.btn}>Hide Col</button>
        <button onClick={showColumn} style={styles.btn}>Show Col</button>
      </div>

      {/* Toolbar 4: Advanced */}
      <div style={styles.toolbar}>
        <button onClick={() => setShowFindReplace(true)} style={styles.btn}>Find & Replace</button>
        <button onClick={addCellNote} style={styles.btn}>Add Note</button>
        
        <div style={styles.divider}></div>
        
        <select onChange={(e) => e.target.value && calculateAutoSum(e.target.value)} style={styles.select}>
          <option value="">AutoSum</option>
          <option value="sum">Sum</option>
          <option value="average">Average</option>
          <option value="count">Count</option>
          <option value="max">Max</option>
          <option value="min">Min</option>
        </select>
        
        <div style={styles.divider}></div>
        
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{display: 'none'}} />
        <button onClick={() => fileInputRef.current.click()} style={styles.btn}>Upload Image</button>
        
        <div style={styles.divider}></div>
        
        <button onClick={exportFile} style={styles.btn}>Export</button>
        <button onClick={printSheet} style={styles.btn}>Print</button>
        <button onClick={createPDF} style={styles.btn}>PDF</button>
        <button onClick={takeScreenshot} style={styles.btn}>Screenshot</button>
      </div>

      {/* Workbook */}
      <div style={styles.workbookWrapper}>
        <Workbook ref={workbookRef} data={data} />
      </div>

      {/* Notes Section */}
      <div style={styles.notesArea}>
        <strong>Sheet Notes:</strong>
        <textarea 
          value={sheetNotes} 
          onChange={(e) => setSheetNotes(e.target.value)}
          placeholder="Add notes for this worksheet..."
          style={styles.textarea}
        />
      </div>

      {/* Font Popup */}
      {showFontPopup && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Font Settings</h3>
            <div style={styles.formRow}>
              <label>Font Family:</label>
              <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} style={styles.select}>
                {fontFamilies.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div style={styles.formRow}>
              <label>Font Size:</label>
              <select value={selectedSize} onChange={(e) => setSelectedSize(Number(e.target.value))} style={styles.select}>
                {fontSizes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={styles.modalButtons}>
              <button onClick={applyFont} style={styles.btnPrimary}>Apply</button>
              <button onClick={() => setShowFontPopup(false)} style={styles.btn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Find Replace Dialog */}
      {showFindReplace && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Find and Replace</h3>
            <div style={styles.formRow}>
              <label>Find:</label>
              <input type="text" value={findText} onChange={(e) => setFindText(e.target.value)} style={styles.input} />
            </div>
            <div style={styles.formRow}>
              <label>Replace with:</label>
              <input type="text" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} style={styles.input} />
            </div>
            <div style={styles.modalButtons}>
              <button onClick={performFindReplace} style={styles.btnPrimary}>Replace All</button>
              <button onClick={() => setShowFindReplace(false)} style={styles.btn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Note Dialog */}
      {showNoteDialog && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Add Cell Note</h3>
            <textarea 
              value={noteText} 
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter note..."
              style={styles.textareaModal}
            />
            <div style={styles.modalButtons}>
              <button onClick={saveCellNote} style={styles.btnPrimary}>Save</button>
              <button onClick={() => setShowNoteDialog(false)} style={styles.btn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
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
    alignItems: 'center',
    gap: '5px',
    padding: '8px 12px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #d0d0d0',
    flexWrap: 'wrap',
  },
  btn: {
    padding: '6px 12px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  btnPrimary: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: '#d0d0d0',
    margin: '0 8px',
  },
  colorLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  colorInput: {
    width: '28px',
    height: '28px',
    border: '1px solid #ccc',
    cursor: 'pointer',
  },
  select: {
    padding: '6px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '13px',
  },
  workbookWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  notesArea: {
    padding: '10px',
    backgroundColor: '#fafafa',
    borderTop: '1px solid #d0d0d0',
  },
  textarea: {
    width: '100%',
    height: '60px',
    marginTop: '5px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '13px',
    resize: 'vertical',
  },
  textareaModal: {
    width: '100%',
    height: '100px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '13px',
    resize: 'vertical',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    minWidth: '400px',
    maxWidth: '90%',
  },
  formRow: {
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginTop: '4px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
};

export default FortuneSheetApp;