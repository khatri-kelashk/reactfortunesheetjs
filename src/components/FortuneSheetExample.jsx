import React, { useState, useRef } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';

const FortuneSheetExample = () => {
  const workbookRef = useRef(null);
  const [data, setData] = useState([
    {
      name: 'Sheet1',
      celldata: [
        // { r: 0, c: 0, v: { v: 'Bold Text', bl: 1 } },
        // { r: 0, c: 1, v: { v: 'Italic Text', it: 1 } },
        // { r: 0, c: 2, v: { v: 'Underline', un: 1 } },
        // { r: 1, c: 0, v: { v: 'Regular Text' } },
        // { r: 1, c: 1, v: { v: 'Click a cell and use buttons above' } },
        // { r: 2, c: 0, v: { v: 'Red Text', fc: '#ff0000' } },
        // { r: 2, c: 1, v: { v: 'Blue Background', bg: '#add8e6' } },
      ],
      order: 0,
      index: 0,
    },
  ]);

  const [selectedRange, setSelectedRange] = useState(null);

    const forceUpdate = () => {//debugger;
    if (workbookRef?.current) {
      // Get current data from workbook
      // console.log(
      //   "workbookRef?.current?.getAllSheets()",
      //   workbookRef?.current?.getAllSheets()
      // );
      // console.log(
      //   "workbookRef?.current?.getSelectionCoordinates()",
      //   workbookRef?.current?.getSelectionCoordinates()
      // );
      const currentData =  workbookRef?.current?.getSheet()
      console.log(
        "workbookRef?.current?.getSheet()",
        workbookRef?.current?.getSheet()
      );
         //updateSheet()
      setData(currentData);
    }
  };

  const updateCellFormatOld = (formatProperty, formatValue) => {
    
    if (!workbookRef?.current?.getSelection()) {
      alert('Please select a cell first');
      return;
    }

    const { row, column, sheetIndex } = workbookRef?.current?.getSelection();
    
    // setData(prevData => {//debugger;
    //   const newData = JSON.parse(JSON.stringify(prevData));
    //   const sheet = newData[sheetIndex || 0];
      
    //   // Find existing cell or create new one
    //   let cellIndex = sheet.data.findIndex(
    //     cell => cell.r === row[0] && cell.c === column[0]
    //   );
      
    //   if (cellIndex === -1) {
    //     // Create new cell if it doesn't exist
    //     sheet.celldata.push({
    //       r: row[0],
    //       c: column[0],
    //       v: { v: '' }
    //     });
    //     cellIndex = sheet.celldata.length - 1;
    //   }
      
    //   // Get current cell value
    //   const cell = sheet.celldata[cellIndex];
    //   const currentValue = cell.v.v || '';
      
    //   // Toggle or set the format
    //   if (formatProperty === 'bl' || formatProperty === 'it' || formatProperty === 'un') {
    //     // Toggle boolean properties
    //     const currentState = cell.v[formatProperty] === 1;
    //     cell.v = {
    //       ...cell.v,
    //       v: currentValue,
    //       [formatProperty]: currentState ? 0 : 1
    //     };
    //   } else {
    //     // Set direct value properties (color, font size, etc.)
    //     cell.v = {
    //       ...cell.v,
    //       v: currentValue,
    //       [formatProperty]: formatValue
    //     };
    //   }
      
    //   return newData;
    // });
  };
  // Update cell format
  // const updateCellFormat = (formatProperty, formatValue) => {debugger;
  //   if (!workbookRef?.current) {
  //     console.error("Workbook reference not found");
  //     return;
  //   }

  //   const selection = workbookRef.current.getSelection();
  //   if (!selection || selection.length === 0) {
  //     alert('Please select a cell first');
  //     return;
  //   }

  //   // Apply format to selected cells
  //   selection.forEach((range) => {
  //     for (let r = range.row[0]; r <= range.row[1]; r++) {
  //       for (let c = range.column[0]; c <= range.column[1]; c++) {
  //         workbookRef.current.setCellFormat(r, c, {
  //           [formatProperty]: formatValue
  //         });
  //       }
  //     }
  //   });
  // };
   // Update cell format with force update
  const updateCellFormatold2 = (formatProperty, formatValue) => {
    if (!workbookRef?.current) {
      console.error("Workbook reference not found");
      return;
    }
      // console.log(
      //   "workbookRef?.current?.getSelectionCoordinates()",
      //   workbookRef?.current?.getSelectionCoordinates()
      // );

    const selection = workbookRef.current.getSelection();
    console.log(selection);
    
    if (!selection || selection.length === 0) {
      alert('Please select a cell first');
      return;
    }

    let hasChanges = false;
    
    // Apply format to selected cells
    /*
    selection.forEach((range) => {
      for (let r = range.row[0]; r <= range.row[1]; r++) {
        for (let c = range.column[0]; c <= range.column[1]; c++) {
          workbookRef.current.setCellFormat(r, c, {
            [formatProperty]: formatValue
          });
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      forceUpdate();
    }*/
  };
  const updateCellFormat = (formatProperty, formatValue) => {
    if (!workbookRef?.current) {
      console.error("Workbook reference not found");
      return;
    }

    const selectedCell = workbookRef.current.getSelection();
    console.log(selectedCell);
    
    if (!selectedCell || selectedCell.length === 0) {
      alert('Please select a cell first');
      return;
    }

  if (!selectedCell?.length) return;

  setData(prevData =>
    prevData?.map((sheet, sheetIndex) => {
      console.log("inner state sheet map", sheet);
      
      // If you later support multiple sheets selection,
      // this is where you'd filter by active sheet
      return {
        ...sheet,
        celldata: sheet?.celldata?.map(cell => {
          const isInSelectedRange = selectedCell?.some(sel => {
      console.log("sel", sel);

            const [rStart, rEnd] = sel.row;
            const [cStart, cEnd] = sel.column;

            return (
              cell.r >= rStart &&
              cell.r <= rEnd &&
              cell.c >= cStart &&
              cell.c <= cEnd
            );
          });
          console.log("isInSelectedRange", isInSelectedRange);
          

          if (!isInSelectedRange) return cell;

          return {
            ...cell,
            v: {
              ...cell.v,
              [formatProperty]: formatValue,
            },
          };
        }),
      };
    })
  );
};

  // Update cell value
  const updateCellValue = (value) => {
    if (!workbookRef?.current) {
      console.error("Workbook reference not found");
      return;
    }

    const selection = workbookRef.current.getSelection();
    if (!selection || selection.length === 0) {
      alert('Please select a cell first');
      return;
    }

    let hasChanges = false;
    
    selection.forEach((range) => {
      for (let r = range.row[0]; r <= range.row[1]; r++) {
        for (let c = range.column[0]; c <= range.column[1]; c++) {
          workbookRef.current.setCellValue(r, c, value);
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      forceUpdate();
    }
  };

  // Alternative: Update through data directly
  const updateCellDirectly = () => {
    if (!workbookRef?.current) return;
    
    const selection = workbookRef.current.getSelection();
    if (!selection || selection.length === 0) {
      alert('Please select a cell first');
      return;
    }

    // Create a deep copy of data
    const newData = JSON.parse(JSON.stringify(workbookRef?.current?.getSheet()));
    console.log("newData", newData);
    console.log(
        "workbookRef?.current?.getSheet()",
        workbookRef?.current?.getSheet()
      );
    
    
    selection.forEach((range) => {
      for (let r = range.row[0]; r <= range.row[1]; r++) {
        for (let c = range.column[0]; c <= range.column[1]; c++) {
          // Find or create the cell
          const existingCellIndex = newData?.celldata?.findIndex(
            cell => cell.r === r && cell.c === c
          );
          console.log("existingCellIndex", existingCellIndex);
          if (existingCellIndex >= 0) {
            // Update existing cell
            newData.celldata[existingCellIndex].v = { 
              ...newData.celldata[existingCellIndex].v,
              v: "Updated Value",
              // Add format if needed
              s: {
                bg: "#FFFF00",
                fc: "#FF0000",
                bl: 1
              }
            };
          } else {
            // Add new cell
            newData.celldata.push({
              r,
              c,
              v: {
                v: "New Value",
                s: {
                  bg: "#FFFF00",
                  fc: "#FF0000",
                  bl: 1
                }
              }
            });
          }
        }
      }
    });

    setData(newData);
  };

  // Example functions for different formats
  const makeBold = () => {
    updateCellFormat('bl', 1); // bl: bold
  };

  const changeFontColor = () => {
    updateCellFormat('fc', '#FF0000'); // fc: font color
  };

  const changeBackgroundColor = () => {
    updateCellFormat('bg', '#FFFF00'); // bg: background color
  };

  const changeFontSize = () => {
    updateCellFormat('fs', 16); // fs: font size
  };

  const alignCenter = () => {
    updateCellFormat('ht', 1); // ht: horizontal alignment (1 = center)
  };

  const setCurrencyFormat = () => {
    updateCellFormat('ct', { fa: '"$"#,##0.00', t: 'n' }); // ct: cell type, n: number
  };

  const setDateFormat = () => {
    updateCellFormat('ct', { fa: 'yyyy-mm-dd', t: 'd' }); // d: date
  };

  const setBoldRedText = () => {
    // Multiple format properties at once
    if (!workbookRef?.current) return;
    
    const selection = workbookRef.current.getSelection();
    if (!selection || selection.length === 0) {
      alert('Please select a cell first');
      return;
    }

    selection.forEach((range) => {
      for (let r = range.row[0]; r <= range.row[1]; r++) {
        for (let c = range.column[0]; c <= range.column[1]; c++) {
          workbookRef.current.setCellFormat(r, c, {
            bl: 1,     // bold
            fc: '#FF0000', // font color red
            fs: 14     // font size 14
          });
        }
      }
    });
  };

  // Update specific cell value
  const updateSpecificCell = () => {
    if (workbookRef?.current) {
      // Update cell at row 0, column 0
      workbookRef.current.setCellValue(0, 0, "Updated Value");
      
      // Update format for the same cell
      workbookRef.current.setCellFormat(0, 0, {
        bl: 1,
        fc: '#00FF00'
      });
    }
  };

  // Get cell information
  const getCellInfo = () => {
    if (!workbookRef?.current) return;
    
    const selection = workbookRef.current.getSelection();
    if (!selection || selection.length === 0) {
      alert('Please select a cell first');
      return;
    }

    const range = selection[0];
    const cellValue = workbookRef.current.getCellValue(range.row[0], range.column[0]);
    const cellFormat = workbookRef.current.getCellFormat(range.row[0], range.column[0]);
    
    console.log('Cell Value:', cellValue);
    console.log('Cell Format:', cellFormat);
  };


  // Handle range selection - store selected range from onRangeSelect callback
  const handleRangeSelect = (range) => {debugger;
    if (range && range.length > 0) {
      setSelectedRange(range[0]);
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Custom Toolbar */}
      <div style={{ 
        padding: '10px', 
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ fontWeight: 'bold', marginRight: '10px' }}>
          Format:
        </div>
        
        <button onClick={() => updateCellFormat('bl', 1)} style={buttonStyle}>
          <strong>B</strong> Bold
        </button>
        <button onClick={() => updateCellFormat('it')} style={buttonStyle}>
          <em>I</em> Italic
        </button>
        <button onClick={() => updateCellFormat('un')} style={buttonStyle}>
          <u>U</u> Underline
        </button>
        
        <div style={{ borderLeft: '1px solid #ccc', height: '24px', margin: '0 5px' }} />
        
        <button onClick={() => updateCellFormat('fs', 10)} style={buttonStyle}>
          10px
        </button>
        <button onClick={() => updateCellFormat('fs', 14)} style={buttonStyle}>
          14px
        </button>
        <button onClick={() => updateCellFormat('fs', 18)} style={buttonStyle}>
          18px
        </button>
        <button onClick={() => updateCellFormat('fs', 24)} style={buttonStyle}>
          24px
        </button>
        
        <div style={{ borderLeft: '1px solid #ccc', height: '24px', margin: '0 5px' }} />
        
        <button onClick={() => updateCellFormat('fc', '#ff0000')} style={{...buttonStyle, color: '#ff0000'}}>
          Red
        </button>
        <button onClick={() => updateCellFormat('fc', '#0000ff')} style={{...buttonStyle, color: '#0000ff'}}>
          Blue
        </button>
        <button onClick={() => updateCellFormat('fc', '#00aa00')} style={{...buttonStyle, color: '#00aa00'}}>
          Green
        </button>
        <button onClick={() => updateCellFormat('fc', '#000000')} style={buttonStyle}>
          Black
        </button>
        
        <div style={{ borderLeft: '1px solid #ccc', height: '24px', margin: '0 5px' }} />
        
        <button onClick={() => updateCellFormat('bg', '#ffff00')} style={{...buttonStyle, backgroundColor: '#ffff00'}}>
          Yellow
        </button>
        <button onClick={() => updateCellFormat('bg', '#90ee90')} style={{...buttonStyle, backgroundColor: '#90ee90'}}>
          Green
        </button>
        <button onClick={() => updateCellFormat('bg', '#add8e6')} style={{...buttonStyle, backgroundColor: '#add8e6'}}>
          Blue
        </button>
        <button onClick={() => updateCellFormat('bg', null)} style={buttonStyle}>
          No BG
        </button>
        
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#666' }}>
          {selectedRange ? `Selected: Row ${selectedRange.row[0] + 1}, Col ${selectedRange.column[0] + 1}` : 'No cell selected'}
        </div>
      </div>
      <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5' }}>
        <h3>Cell Controls</h3>
        <button onClick={updateCellDirectly} style={{ marginRight: '5px' }}>Bold</button>
        <button onClick={() => changeFontColor()} style={{ marginRight: '5px' }}>Red Text</button>
        <button onClick={() => changeBackgroundColor()} style={{ marginRight: '5px' }}>Yellow BG</button>
        <button onClick={() => changeFontSize()} style={{ marginRight: '5px' }}>Font Size 16</button>
        <button onClick={alignCenter} style={{ marginRight: '5px' }}>Align Center</button>
        <button onClick={() => updateCellValue("New Value")} style={{ marginRight: '5px' }}>Set Text</button>
        <button onClick={setBoldRedText} style={{ marginRight: '5px' }}>Bold Red Text</button>
        <button onClick={setCurrencyFormat} style={{ marginRight: '5px' }}>Currency Format</button>
        <button onClick={setDateFormat} style={{ marginRight: '5px' }}>Date Format</button>
        <button onClick={updateSpecificCell} style={{ marginRight: '5px' }}>Update A1</button>
        <button onClick={getCellInfo}>Get Cell Info</button>
      </div>

      {/* FortuneSheet Workbook */}
      <div style={{ flex: 1 }}>
        <Workbook
          ref={workbookRef}
          data={data}
          onChange={(newData) => {
            console.log('Sheet data changed:', newData);
            setData(newData);
          }}
          onRangeSelect={handleRangeSelect}
          allowEdit={true}
                  style={{ height: '600px' }}

        />
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '6px 12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: 'white',
  cursor: 'pointer',
  fontSize: '13px',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#f0f0f0'
  }
};

export default FortuneSheetExample;