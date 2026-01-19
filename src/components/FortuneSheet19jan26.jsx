import React, { useRef, useState } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import axios from 'axios';

const FortuneSheetCustom = () => {
  const workbookRef = useRef(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Initial sheet data with custom column widths and row heights
  const [sheets, setSheets] = useState([
    {
      name: 'Sheet1',
      config: {
        columnlen: {
          '0': 120,  // Column A width
          '1': 80,   // Column B width
          '2': 150,  // Column C width
          '3': 200,  // Column D width (wider for descriptions)
        },
        rowlen: {
          '0': 30,   // Row 1 height (header)
          '1': 25,   // Row 2 height
          '2': 25,   // Row 3 height
        },
      },
      celldata: [
        { r: 0, c: 0, v: { v: 'Name', bl: 1, bg: '#f0f0f0' } },
        { r: 0, c: 1, v: { v: 'Age', bl: 1, bg: '#f0f0f0' } },
        { r: 0, c: 2, v: { v: 'City', bl: 1, bg: '#f0f0f0' } },
        { r: 0, c: 3, v: { v: 'Description', bl: 1, bg: '#f0f0f0' } },
        { r: 1, c: 0, v: { v: 'John Doe' } },
        { r: 1, c: 1, v: { v: 30 } },
        { r: 1, c: 2, v: { v: 'New York' } },
        { r: 1, c: 3, v: { v: 'Software Engineer at Tech Corp' } },
        { r: 2, c: 0, v: { v: 'Jane Smith' } },
        { r: 2, c: 1, v: { v: 25 } },
        { r: 2, c: 2, v: { v: 'London' } },
        { r: 2, c: 3, v: { v: 'Product Designer' } },
        { r: 3, c: 0, v: { v: 'Bob Johnson' } },
        { r: 3, c: 1, v: { v: 35 } },
        { r: 3, c: 2, v: { v: 'Paris' } },
        { r: 3, c: 3, v: { v: 'Marketing Manager' } },
      ],
    },
  ]);

  // Get current selection
  const getSelection = () => {
    const selection = workbookRef.current?.getSelection();
    if (!selection || selection.length === 0) {
      alert('Please select a cell first!');
      return null;
    }
    return selection[0];
  };

  // Save sheet data to backend
  const saveToBackend = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('Saving...');

      // Get all sheet data
      const allSheetData = workbookRef.current?.getAllSheets();
      
      // Prepare data for backend
      const dataToSave = {
        sheets: allSheetData,
        timestamp: new Date().toISOString(),
        metadata: {
          totalSheets: allSheetData?.length || 0,
          lastModified: new Date().toISOString(),
        }
      };

      // Send to backend using axios
      const response = await axios.post('http://localhost:3000/api/sheets/save', dataToSave, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSaveStatus('✓ Saved successfully!');
      console.log('Save response:', response.data);

      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('✗ Save failed: ' + error.message);
      console.error('Error saving sheet:', error);
      setTimeout(() => setSaveStatus(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Export sheet data as JSON
  const exportAsJSON = () => {
    const allSheetData = workbookRef.current?.getAllSheets();
    const dataStr = JSON.stringify(allSheetData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sheet-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Resize column width
  const resizeColumn = () => {
    const selection = getSelection();
    if (!selection) return;

    const { column } = selection;
    const colIndex = column[0];
    
    const currentWidths = workbookRef.current?.getColumnWidth([colIndex]);
    const currentWidth = currentWidths?.[colIndex] || 73; // Default width is 73
    
    const newWidth = prompt(`Enter new width for column ${String.fromCharCode(65 + colIndex)} (current: ${currentWidth}px):`, currentWidth);
    
    if (newWidth !== null && !isNaN(newWidth) && Number(newWidth) > 0) {
      workbookRef.current?.setColumnWidth({ [colIndex]: Number(newWidth) });
      updateSelectedInfo();
      alert(`Column ${String.fromCharCode(65 + colIndex)} resized to ${newWidth}px`);
    }
  };

  // Resize row height
  const resizeRow = () => {
    const selection = getSelection();
    if (!selection) return;

    const { row } = selection;
    const rowIndex = row[0];
    
    const currentHeights = workbookRef.current?.getRowHeight([rowIndex]);
    const currentHeight = currentHeights?.[rowIndex] || 19; // Default height is 19
    
    const newHeight = prompt(`Enter new height for row ${rowIndex + 1} (current: ${currentHeight}px):`, currentHeight);
    
    if (newHeight !== null && !isNaN(newHeight) && Number(newHeight) > 0) {
      workbookRef.current?.setRowHeight({ [rowIndex]: Number(newHeight) });
      updateSelectedInfo();
      alert(`Row ${rowIndex + 1} resized to ${newHeight}px`);
    }
  };

  // Auto resize column to fit content
  const autoResizeColumn = () => {
    const selection = getSelection();
    if (!selection) return;

    const { column } = selection;
    const colIndex = column[0];
    
    // Get all cells in this column and calculate max width needed
    // This is a simplified version - you might want to improve the calculation
    alert(`Auto-resize for column ${String.fromCharCode(65 + colIndex)} will be based on content. Setting to 150px as example.`);
    workbookRef.current?.setColumnWidth({ [colIndex]: 150 });
    updateSelectedInfo();
  };

  // Make text bold
  const makeBold = () => {
    const selection = getSelection();
    if (!selection) return;

    const { row, column } = selection;
    const currentValue = workbookRef.current?.getCellValue(row[0], column[0]);
    const isBold = currentValue?.bl === 1;

    workbookRef.current?.setCellFormat(row[0], column[0], 'bl', isBold ? 0 : 1);
    updateSelectedInfo();
  };

  // Make text italic
  const makeItalic = () => {
    const selection = getSelection();
    if (!selection) return;

    const { row, column } = selection;
    const currentValue = workbookRef.current?.getCellValue(row[0], column[0]);
    const isItalic = currentValue?.it === 1;

    workbookRef.current?.setCellFormat(row[0], column[0], 'it', isItalic ? 0 : 1);
    updateSelectedInfo();
  };

  // Make text underline
  const makeUnderline = () => {
    const selection = getSelection();
    if (!selection) return;

    const { row, column } = selection;
    const currentValue = workbookRef.current?.getCellValue(row[0], column[0]);
    const isUnderline = currentValue?.un === 1;

    workbookRef.current?.setCellFormat(row[0], column[0], 'un', isUnderline ? 0 : 1);
    updateSelectedInfo();
  };

  // Change background color
  const changeBackgroundColor = (color) => {
    const selection = getSelection();
    if (!selection) return;

    const { row, column } = selection;
    workbookRef.current?.setCellFormat(row[0], column[0], 'bg', color);
    updateSelectedInfo();
  };

  // Change text color
  const changeTextColor = (color) => {
    const selection = getSelection();
    if (!selection) return;

    const { row, column } = selection;
    workbookRef.current?.setCellFormat(row[0], column[0], 'fc', color);
    updateSelectedInfo();
  };

  // Change font size
  const changeFontSize = (size) => {
    const selection = getSelection();
    if (!selection) return;

    const { row, column } = selection;
    workbookRef.current?.setCellFormat(row[0], column[0], 'fs', size);
    updateSelectedInfo();
  };

  // Update cell value
  const updateCellValue = () => {
    const selection = getSelection();
    if (!selection) return;

    const { row, column } = selection;
    const currentValue = workbookRef.current?.getCellValue(row[0], column[0]);
    const newValue = prompt('Enter new value:', currentValue?.v || '');
    
    if (newValue !== null) {
      workbookRef.current?.setCellValue(row[0], column[0], newValue);
      updateSelectedInfo();
    }
  };

  // Clear cell formatting
  const clearFormatting = () => {
    const selection = getSelection();
    if (!selection) return;

    const { row, column } = selection;
    
    workbookRef.current?.setCellFormat(row[0], column[0], 'bl', 0);
    workbookRef.current?.setCellFormat(row[0], column[0], 'it', 0);
    workbookRef.current?.setCellFormat(row[0], column[0], 'un', 0);
    workbookRef.current?.setCellFormat(row[0], column[0], 'bg', null);
    workbookRef.current?.setCellFormat(row[0], column[0], 'fc', '#000000');
    workbookRef.current?.setCellFormat(row[0], column[0], 'fs', 10);
    
    updateSelectedInfo();
  };

  // Update selected cell information
  const updateSelectedInfo = () => {
    const selection = workbookRef.current?.getSelection();
    if (selection && selection.length > 0) {
      const { row, column } = selection[0];
      const cellValue = workbookRef.current?.getCellValue(row[0], column[0]);
      
      // Get column width and row height
      const colWidths = workbookRef.current?.getColumnWidth([column[0]]);
      const rowHeights = workbookRef.current?.getRowHeight([row[0]]);
      
      setSelectedInfo({
        row: row[0],
        col: column[0],
        value: cellValue?.v || '',
        bold: cellValue?.bl === 1,
        italic: cellValue?.it === 1,
        underline: cellValue?.un === 1,
        bg: cellValue?.bg,
        fc: cellValue?.fc,
        fs: cellValue?.fs,
        colWidth: colWidths?.[column[0]] || 73,
        rowHeight: rowHeights?.[row[0]] || 19,
      });
    }
  };

  // Handle data changes
  const handleChange = () => {
    updateSelectedInfo();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Fortune Sheet Custom Controls</h2>
        <p style={styles.subtitle}>Select a cell and use the buttons below to modify it</p>
      </div>

      {/* Save/Export Section */}
      <div style={styles.saveSection}>
        <button 
          style={{...styles.saveButton, ...styles.primaryButton}} 
          onClick={saveToBackend}
          disabled={isSaving}
        >
          {isSaving ? '💾 Saving...' : '💾 Save to Backend'}
        </button>
        <button 
          style={styles.saveButton} 
          onClick={exportAsJSON}
        >
          📥 Export as JSON
        </button>
        {saveStatus && (
          <span style={{
            ...styles.saveStatus,
            color: saveStatus.includes('✓') ? '#28a745' : '#dc3545'
          }}>
            {saveStatus}
          </span>
        )}
      </div>

      <div style={styles.toolbar}>
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Text Formatting</h4>
          <div style={styles.buttonGroup}>
            <button 
              style={{...styles.button, fontWeight: selectedInfo?.bold ? 'bold' : 'normal'}} 
              onClick={makeBold}
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button 
              style={{...styles.button, fontStyle: selectedInfo?.italic ? 'italic' : 'normal'}} 
              onClick={makeItalic}
              title="Italic"
            >
              <em>I</em>
            </button>
            <button 
              style={{...styles.button, textDecoration: selectedInfo?.underline ? 'underline' : 'none'}} 
              onClick={makeUnderline}
              title="Underline"
            >
              <u>U</u>
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Font Size</h4>
          <div style={styles.buttonGroup}>
            <button style={styles.button} onClick={() => changeFontSize(10)}>10</button>
            <button style={styles.button} onClick={() => changeFontSize(12)}>12</button>
            <button style={styles.button} onClick={() => changeFontSize(14)}>14</button>
            <button style={styles.button} onClick={() => changeFontSize(18)}>18</button>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Background Color</h4>
          <div style={styles.buttonGroup}>
            <button
              style={{...styles.colorButton, backgroundColor: '#FFE6E6'}}
              onClick={() => changeBackgroundColor('#FFE6E6')}
              title="Light Red"
            />
            <button
              style={{...styles.colorButton, backgroundColor: '#E6F3FF'}}
              onClick={() => changeBackgroundColor('#E6F3FF')}
              title="Light Blue"
            />
            <button
              style={{...styles.colorButton, backgroundColor: '#E6FFE6'}}
              onClick={() => changeBackgroundColor('#E6FFE6')}
              title="Light Green"
            />
            <button
              style={{...styles.colorButton, backgroundColor: '#FFF9E6'}}
              onClick={() => changeBackgroundColor('#FFF9E6')}
              title="Light Yellow"
            />
            <button
              style={{...styles.colorButton, backgroundColor: '#FFFFFF', border: '2px solid #999'}}
              onClick={() => changeBackgroundColor(null)}
              title="Clear"
            >
              ✕
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Text Color</h4>
          <div style={styles.buttonGroup}>
            <button
              style={{...styles.colorButton, backgroundColor: '#FF0000'}}
              onClick={() => changeTextColor('#FF0000')}
              title="Red"
            />
            <button
              style={{...styles.colorButton, backgroundColor: '#0000FF'}}
              onClick={() => changeTextColor('#0000FF')}
              title="Blue"
            />
            <button
              style={{...styles.colorButton, backgroundColor: '#00AA00'}}
              onClick={() => changeTextColor('#00AA00')}
              title="Green"
            />
            <button
              style={{...styles.colorButton, backgroundColor: '#000000'}}
              onClick={() => changeTextColor('#000000')}
              title="Black"
            />
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Cell Resize</h4>
          <div style={styles.buttonGroup}>
            <button style={styles.actionButton} onClick={resizeColumn}>
              ↔️ Resize Column
            </button>
            <button style={styles.actionButton} onClick={resizeRow}>
              ↕️ Resize Row
            </button>
            <button style={styles.actionButton} onClick={autoResizeColumn}>
              📏 Auto Column
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Actions</h4>
          <div style={styles.buttonGroup}>
            <button style={styles.actionButton} onClick={updateCellValue}>
              📝 Edit Value
            </button>
            <button style={styles.actionButton} onClick={clearFormatting}>
              🧹 Clear Format
            </button>
          </div>
        </div>
      </div>

      <div style={styles.sheetContainer}>
        <Workbook
          ref={workbookRef}
          data={sheets}
          onChange={handleChange}
        />
      </div>

      {selectedInfo && (
        <div style={styles.info}>
          <div style={styles.infoRow}>
            <strong>Selected Cell:</strong> 
            <span style={styles.infoValue}>
              {String.fromCharCode(65 + selectedInfo.col)}{selectedInfo.row + 1}
            </span>
          </div>
          <div style={styles.infoRow}>
            <strong>Value:</strong> 
            <span style={styles.infoValue}>{selectedInfo.value || '(empty)'}</span>
          </div>
          <div style={styles.infoRow}>
            <strong>Format:</strong> 
            <span style={styles.infoValue}>
              {selectedInfo.bold && 'Bold '}
              {selectedInfo.italic && 'Italic '}
              {selectedInfo.underline && 'Underline '}
              {!selectedInfo.bold && !selectedInfo.italic && !selectedInfo.underline && 'None'}
            </span>
          </div>
          <div style={styles.infoRow}>
            <strong>Dimensions:</strong> 
            <span style={styles.infoValue}>
              Column: {selectedInfo.colWidth}px | Row: {selectedInfo.rowHeight}px
            </span>
          </div>
        </div>
      )}

      {/* Important Notes Section */}
      <div style={styles.notesSection}>
        <h3 style={styles.notesTitle}>⚠️ Important Notes:</h3>
        <div style={styles.note}>
          <strong>Image Insertion:</strong> Unfortunately, image insertion is <strong>NOT YET IMPLEMENTED</strong> in the current version of @fortune-sheet/react. 
          It's listed as a planned feature (marked with strikethrough in the documentation). 
          You'll need to wait for a future update or consider alternative approaches like storing image URLs in cells and displaying them externally.
        </div>
        <div style={styles.note}>
          <strong>Cell Resizing:</strong> Use the resize buttons above to programmatically change column widths and row heights. 
          You can also manually drag column/row borders in the sheet interface.
        </div>
        <div style={styles.apiEndpoint}>
          <strong>Save API Endpoint:</strong>
          <code style={styles.code}>POST http://localhost:3000/api/sheets/save</code>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 5px 0',
    color: '#333',
    fontSize: '24px',
  },
  subtitle: {
    margin: '0',
    color: '#666',
    fontSize: '14px',
  },
  saveSection: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '2px solid #dee2e6',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  primaryButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: '1px solid #007bff',
  },
  saveStatus: {
    fontSize: '14px',
    fontWeight: '600',
    marginLeft: '10px',
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionTitle: {
    margin: '0 0 5px 0',
    fontSize: '12px',
    color: '#555',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonGroup: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    minWidth: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  colorButton: {
    width: '32px',
    height: '32px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
  },
  actionButton: {
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  sheetContainer: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    height: '500px',
  },
  info: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#e8f4f8',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#333',
  },
  infoRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '5px',
  },
  infoValue: {
    color: '#0066cc',
    fontWeight: '500',
  },
  notesSection: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    border: '2px solid #ffc107',
  },
  notesTitle: {
    margin: '0 0 15px 0',
    fontSize: '16px',
    color: '#856404',
  },
  note: {
    marginBottom: '15px',
    fontSize: '14px',
    color: '#856404',
    lineHeight: '1.6',
  },
  apiEndpoint: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#333',
  },
  code: {
    display: 'block',
    marginTop: '5px',
    padding: '8px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'monospace',
  },
};

export default FortuneSheetCustom;