import React, { useRef, useState, useEffect } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const FortuneSheetCustom = () => {
  const workbookRef = useRef(null);
  const sheetContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [overlayImages, setOverlayImages] = useState([]);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Initial sheet data with custom column widths and row heights
  const [sheets, setSheets] = useState([
    {
      name: 'Sheet1',
      config: {
        columnlen: {
          '0': 120,
          '1': 80,
          '2': 150,
          '3': 200,
        },
        rowlen: {
          '0': 30,
          '1': 25,
          '2': 25,
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
        { r: 1, c: 3, v: { v: 'Software Engineer' } },
        { r: 2, c: 0, v: { v: 'Jane Smith' } },
        { r: 2, c: 1, v: { v: 25 } },
        { r: 2, c: 2, v: { v: 'London' } },
        { r: 2, c: 3, v: { v: 'Product Designer' } },
      ],
    },
  ]);

  // useEffect(() => {
  //   // Initial update of selected cell info
  //   console.log("selectedInfo", selectedInfo);
  //   ;
  // }, [selectedInfo]);

  // Get current selection
  const getSelection = () => {
    const selection = workbookRef.current?.getSelection();
    if (!selection || selection.length === 0) {
      alert('Please select a cell first!');
      return null;
    }
    return selection[0];
  };

  // Calculate cell position in pixels
  const getCellPosition = (row, col) => {
    const container = sheetContainerRef.current;
    if (!container) return null;

    // Get all column widths up to the target column
    let left = 46; // Initial offset for row headers
    for (let i = 0; i < col; i++) {
      const widths = workbookRef.current?.getColumnWidth([i]);
      left += widths?.[i] || 73; // Default width is 73
    }

    // Get all row heights up to the target row
    let top = 20; // Initial offset for column headers
    for (let i = 0; i < row; i++) {
      const heights = workbookRef.current?.getRowHeight([i]);
      top += heights?.[i] || 19; // Default height is 19
    }

    // Get current cell dimensions
    const colWidths = workbookRef.current?.getColumnWidth([col]);
    const rowHeights = workbookRef.current?.getRowHeight([row]);
    const width = colWidths?.[col] || 73;
    const height = rowHeights?.[row] || 19;

    return { left, top, width, height };
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const selection = getSelection();
    if (!selection) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      
      const img = new Image();
      img.onload = () => {
        insertImageOverlay(imageUrl, img.width, img.height, selection);
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  // Insert image as overlay
  const insertImageOverlay = (src, originalWidth, originalHeight, selection) => {
    const { row, column } = selection;
    const rowIndex = row[0];
    const colIndex = column[0];

    const cellPos = getCellPosition(rowIndex, colIndex);
    if (!cellPos) {
      alert('Could not calculate cell position');
      return;
    }

    // Ask user for resize option
    const resizeOption = window.confirm(
      'Do you want to auto-resize the cell to fit the image?\n\n' +
      `Image: ${originalWidth}x${originalHeight}px\n` +
      `Current Cell: ${cellPos.width}x${cellPos.height}px\n\n` +
      'Click OK to resize cell, Cancel to scale image to fit cell'
    );

    let displayWidth, displayHeight;

    if (resizeOption) {
      // Resize cell to fit image (with some max limits)
      const maxWidth = 400;
      const maxHeight = 300;
      
      displayWidth = Math.min(originalWidth, maxWidth);
      displayHeight = Math.min(originalHeight, maxHeight);

      // Maintain aspect ratio if we hit max
      if (originalWidth > maxWidth || originalHeight > maxHeight) {
        const scale = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
        displayWidth = originalWidth * scale;
        displayHeight = originalHeight * scale;
      }

      // Resize the cell
      workbookRef.current?.setColumnWidth({ [colIndex]: displayWidth });
      workbookRef.current?.setRowHeight({ [rowIndex]: displayHeight });

      // Recalculate position after resize
      setTimeout(() => {
        const newCellPos = getCellPosition(rowIndex, colIndex);
        addImageToOverlay(src, newCellPos, displayWidth, displayHeight, rowIndex, colIndex);
      }, 100);
    } else {
      // Scale image to fit current cell
      displayWidth = cellPos.width - 4; // Leave 2px padding on each side
      displayHeight = cellPos.height - 4;

      // Maintain aspect ratio
      const scale = Math.min(displayWidth / originalWidth, displayHeight / originalHeight);
      displayWidth = originalWidth * scale;
      displayHeight = originalHeight * scale;

      addImageToOverlay(src, cellPos, displayWidth, displayHeight, rowIndex, colIndex);
    }
  };

  // Add image to overlay array
  const addImageToOverlay = (src, cellPos, width, height, row, col) => {
    const newImage = {
      id: Date.now(),
      src,
      left: cellPos.left + 2, // 2px padding
      top: cellPos.top + 2,
      width,
      height,
      row,
      col,
    };

    setOverlayImages(prev => [...prev, newImage]);
    updateSelectedInfo();
  };

  // Remove image overlay
  const removeImageAtCell = () => {
    const selection = getSelection();
    if (!selection) return;

    const { row, column } = selection;
    const rowIndex = row[0];
    const colIndex = column[0];

    const filtered = overlayImages.filter(img => !(img.row === rowIndex && img.col === colIndex));
    
    if (filtered.length === overlayImages.length) {
      alert('No image found in this cell');
    } else {
      setOverlayImages(filtered);
      alert('Image removed from cell');
    }
  };

  // Save sheet data to backend (including overlay images)
  const saveToBackend = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('Saving...');

      const allSheetData = workbookRef.current?.getAllSheets();
      
      const dataToSave = {
        sheets: allSheetData,
        overlayImages: overlayImages, // Include overlay images
        timestamp: new Date().toISOString(),
        metadata: {
          totalSheets: allSheetData?.length || 0,
          imageCount: overlayImages.length,
          lastModified: new Date().toISOString(),
        }
      };

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
    const exportData = {
      sheets: allSheetData,
      overlayImages: overlayImages,
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sheet-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export as PDF using html2canvas + jsPDF
  const exportAsPDF = async () => {
    try {
      setIsExportingPDF(true);
      
      const element = sheetContainerRef.current;
      if (!element) {
        alert('Sheet container not found');
        return;
      }

      // Capture the sheet container with all overlay images
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale = better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // A4 size in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Calculate scaling to fit content
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      // Check if we need multiple pages
      const totalPages = Math.ceil(scaledHeight / pdfHeight);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: scaledWidth > scaledHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      if (totalPages === 1) {
        // Single page PDF
        pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
      } else {
        // Multi-page PDF
        for (let i = 0; i < totalPages; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          const sourceY = i * (imgHeight / totalPages);
          const sourceHeight = imgHeight / totalPages;
          
          // Create a temporary canvas for this page
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgWidth;
          pageCanvas.height = sourceHeight;
          const pageCtx = pageCanvas.getContext('2d');
          
          pageCtx.drawImage(
            canvas,
            0, sourceY, imgWidth, sourceHeight,
            0, 0, imgWidth, sourceHeight
          );
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }
      }

      // Save the PDF
      pdf.save(`fortune-sheet-${Date.now()}.pdf`);
      
      alert(`PDF exported successfully! (${totalPages} page${totalPages > 1 ? 's' : ''})`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF: ' + error.message);
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Resize column width
  const resizeColumn = () => {
    const selection = getSelection();
    if (!selection) return;

    const { column } = selection;
    const colIndex = column[0];
    
    const currentWidths = workbookRef.current?.getColumnWidth([colIndex]);
    const currentWidth = currentWidths?.[colIndex] || 73;
    
    const newWidth = prompt(`Enter new width for column ${String.fromCharCode(65 + colIndex)} (current: ${currentWidth}px):`, currentWidth);
    
    if (newWidth !== null && !isNaN(newWidth) && Number(newWidth) > 0) {
      workbookRef.current?.setColumnWidth({ [colIndex]: Number(newWidth) });
      updateSelectedInfo();
    }
  };

  // Resize row height
  const resizeRow = () => {
    const selection = getSelection();
    if (!selection) return;

    const { row } = selection;
    const rowIndex = row[0];
    
    const currentHeights = workbookRef.current?.getRowHeight([rowIndex]);
    const currentHeight = currentHeights?.[rowIndex] || 19;
    
    const newHeight = prompt(`Enter new height for row ${rowIndex + 1} (current: ${currentHeight}px):`, currentHeight);
    
    if (newHeight !== null && !isNaN(newHeight) && Number(newHeight) > 0) {
      workbookRef.current?.setRowHeight({ [rowIndex]: Number(newHeight) });
      updateSelectedInfo();
    }
  };

  // Text formatting functions
  const makeBold = () => {
    const selection = getSelection();
    if (!selection) return;
    const { row, column } = selection;
    const currentValue = workbookRef.current?.getCellValue(row[0], column[0]);
    const isBold = currentValue?.bl === 1;
    workbookRef.current?.setCellFormat(row[0], column[0], 'bl', isBold ? 0 : 1);
    updateSelectedInfo();
  };

  const makeItalic = () => {
    const selection = getSelection();
    if (!selection) return;
    const { row, column } = selection;
    const currentValue = workbookRef.current?.getCellValue(row[0], column[0]);
    const isItalic = currentValue?.it === 1;
    workbookRef.current?.setCellFormat(row[0], column[0], 'it', isItalic ? 0 : 1);
    updateSelectedInfo();
  };

  const makeUnderline = () => {
    const selection = getSelection();
    if (!selection) return;
    const { row, column } = selection;
    const currentValue = workbookRef.current?.getCellValue(row[0], column[0]);
    const isUnderline = currentValue?.un === 1;
    workbookRef.current?.setCellFormat(row[0], column[0], 'un', isUnderline ? 0 : 1);
    updateSelectedInfo();
  };

  const changeBackgroundColor = (color) => {
    const selection = getSelection();
    if (!selection) return;
    const { row, column } = selection;
    workbookRef.current?.setCellFormat(row[0], column[0], 'bg', color);
    updateSelectedInfo();
  };

  const changeTextColor = (color) => {
    const selection = getSelection();
    if (!selection) return;
    const { row, column } = selection;
    workbookRef.current?.setCellFormat(row[0], column[0], 'fc', color);
    updateSelectedInfo();
  };

  const changeFontSize = (size) => {
    const selection = getSelection();
    if (!selection) return;
    const { row, column } = selection;
    workbookRef.current?.setCellFormat(row[0], column[0], 'fs', size);
    updateSelectedInfo();
  };

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

  const updateSelectedInfo = () => {
    const selection = workbookRef.current?.getSelection();
    if (selection && selection.length > 0) {
      const { row, column } = selection[0];
      const cellValue = workbookRef.current?.getCellValue(row[0], column[0]);
      const colWidths = workbookRef.current?.getColumnWidth([column[0]]);
      const rowHeights = workbookRef.current?.getRowHeight([row[0]]);
      
      // Check if there's an image in this cell
      const imageInCell = overlayImages.find(img => img.row === row[0] && img.col === column[0]);
      
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
        hasImage: !!imageInCell,
      });
    }
  };

  const handleChange = () => {
    updateSelectedInfo();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Fortune Sheet with Image Overlay</h2>
        <p style={styles.subtitle}>Select a cell and insert images that overlay on the sheet</p>
      </div>

      <div style={styles.saveSection}>
        <button 
          style={{...styles.saveButton, ...styles.primaryButton}} 
          onClick={saveToBackend}
          disabled={isSaving}
        >
          {isSaving ? '💾 Saving...' : '💾 Save to Backend'}
        </button>
        <button style={styles.saveButton} onClick={exportAsJSON}>
          📥 Export as JSON
        </button>
        <button style={styles.saveButton} onClick={exportAsPDF}>
          📥 Export as PDF
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
            <button style={{...styles.button, fontWeight: selectedInfo?.bold ? 'bold' : 'normal'}} onClick={makeBold}>
              <strong>B</strong>
            </button>
            <button style={{...styles.button, fontStyle: selectedInfo?.italic ? 'italic' : 'normal'}} onClick={makeItalic}>
              <em>I</em>
            </button>
            <button style={{...styles.button, textDecoration: selectedInfo?.underline ? 'underline' : 'none'}} onClick={makeUnderline}>
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
          <h4 style={styles.sectionTitle}>Colors</h4>
          <div style={styles.buttonGroup}>
            <button style={{...styles.colorButton, backgroundColor: '#FFE6E6'}} onClick={() => changeBackgroundColor('#FFE6E6')} title="BG: Light Red" />
            <button style={{...styles.colorButton, backgroundColor: '#E6F3FF'}} onClick={() => changeBackgroundColor('#E6F3FF')} title="BG: Light Blue" />
            <button style={{...styles.colorButton, backgroundColor: '#FF0000'}} onClick={() => changeTextColor('#FF0000')} title="Text: Red" />
            <button style={{...styles.colorButton, backgroundColor: '#0000FF'}} onClick={() => changeTextColor('#0000FF')} title="Text: Blue" />
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Cell Resize</h4>
          <div style={styles.buttonGroup}>
            <button style={styles.actionButton} onClick={resizeColumn}>
              ↔️ Column
            </button>
            <button style={styles.actionButton} onClick={resizeRow}>
              ↕️ Row
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Image Actions</h4>
          <div style={styles.buttonGroup}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageUpload}
            />
            <button style={{...styles.actionButton, ...styles.imageButton}} onClick={() => fileInputRef.current?.click()}>
              🖼️ Insert Image
            </button>
            <button style={styles.actionButton} onClick={removeImageAtCell}>
              🗑️ Remove Image
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Other Actions</h4>
          <div style={styles.buttonGroup}>
            <button style={styles.actionButton} onClick={updateCellValue}>
              📝 Edit
            </button>
            <button style={styles.actionButton} onClick={clearFormatting}>
              🧹 Clear
            </button>
          </div>
        </div>
      </div>

      <div style={styles.sheetWrapper}>
        <div ref={sheetContainerRef} style={styles.sheetContainer}>
          <Workbook
            ref={workbookRef}
            data={sheets}
            onChange={handleChange}
          />
          
          {/* Image Overlay Layer */}
          <div style={styles.imageOverlayContainer}>
            {overlayImages.map(img => (
              <img
                key={img.id}
                src={img.src}
                alt={`Cell ${img.row},${img.col}`}
                style={{
                  position: 'absolute',
                  left: `${img.left}px`,
                  top: `${img.top}px`,
                  width: `${img.width}px`,
                  height: `${img.height}px`,
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  zIndex: 10,
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>
        </div>
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
            <strong>Dimensions:</strong> 
            <span style={styles.infoValue}>
              {selectedInfo.colWidth}px × {selectedInfo.rowHeight}px
            </span>
          </div>
          <div style={styles.infoRow}>
            <strong>Has Image:</strong> 
            <span style={styles.infoValue}>{selectedInfo.hasImage ? 'Yes ✓' : 'No'}</span>
          </div>
          <div style={styles.infoRow}>
            <strong>Total Images:</strong> 
            <span style={styles.infoValue}>{overlayImages.length}</span>
          </div>
        </div>
      )}

      <div style={styles.notesSection}>
        <h3 style={styles.notesTitle}>📌 How to Use:</h3>
        <div style={styles.note}>
          <strong>1. Insert Image:</strong> Select a cell → Click "Insert Image" → Choose an image file
        </div>
        <div style={styles.note}>
          <strong>2. Auto-Resize:</strong> When prompted, choose "OK" to resize the cell to fit the image, or "Cancel" to scale the image to fit the current cell size
        </div>
        <div style={styles.note}>
          <strong>3. Export PDF:</strong> Click "Export PDF" button to download the sheet as a high-quality PDF file (includes all images and formatting)
        </div>
        <div style={styles.note}>
          <strong>4. Save Data:</strong> Click "Save to Backend" to send data to your server, or "Export JSON" to download as JSON file
        </div>
        <div style={styles.note}>
          <strong>5. Remove Image:</strong> Select a cell with an image → Click "Remove Image"
        </div>
        <div style={styles.noteHighlight}>
          <strong>📦 Required Packages:</strong>
          <code style={styles.codeBlock}>npm install html2canvas jspdf</code>
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
  pdfButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: '1px solid #dc3545',
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
  },
  actionButton: {
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  imageButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: '1px solid #28a745',
    fontWeight: '600',
  },
  sheetWrapper: {
    position: 'relative',
  },
  sheetContainer: {
    position: 'relative',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    height: '500px',
  },
  imageOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 10,
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
    backgroundColor: '#e7f3ff',
    borderRadius: '8px',
    border: '2px solid #0066cc',
  },
  notesTitle: {
    margin: '0 0 15px 0',
    fontSize: '16px',
    color: '#0066cc',
  },
  note: {
    marginBottom: '10px',
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.6',
  },
  noteHighlight: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '1px solid #0066cc',
  },
  codeBlock: {
    display: 'block',
    marginTop: '8px',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'monospace',
    color: '#d63384',
  },
};

export default FortuneSheetCustom;