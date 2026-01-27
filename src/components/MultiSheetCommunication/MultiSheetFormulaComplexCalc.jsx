import React, { useState } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';

/**
 * 
 * {
  r: 0,        // row index
  c: 0,        // column index
  v: {
    v: null,   // calculated value (null for formulas)
    f: '=Sales!A1',  // formula string
    m: '100'   // displayed/formatted value
  }
}
 */
/**
 * Important Notes (Copied from AI Generated Documentation)

   1. Sheet Name Sensitivity: Sheet names are case-sensitive
   2. Circular References: Avoid creating circular references between sheets
   3. Recalculation: Fortune Sheet automatically recalculates formulas when referenced cells change
   4. Range References: You can use ranges like Sheet1!A1:B10 in aggregate functions
   5. Error Handling: If a referenced sheet doesn't exist, the formula will return an error
    
  Best Practices

    1. Use Named Ranges: If available, use meaningful sheet names
    2. Document Dependencies: Keep track of cross-sheet dependencies
    3. Validate References: Ensure referenced sheets exist before using them
    4. Performance: Minimize excessive cross-sheet calculations for large datasets
 * 
 */
function App() {
  const [data] = useState([
    {
    name: 'Data',
    celldata: [
      { r: 0, c: 0, v: { v: 'Product A', m: 'Product A' } },
      { r: 0, c: 1, v: { v: 1000, m: '1000' } },
      { r: 1, c: 0, v: { v: 'Product B', m: 'Product B' } },
      { r: 1, c: 1, v: { v: 2000, m: '2000' } },
    ],
  },
  {
    name: 'Analysis',
    celldata: [
      // AVERAGE across sheets
      { 
        r: 0, 
        c: 0, 
        v: { 
          f: '=AVERAGE(Data!B1:B2)',
          m: '1500'
        } 
      },
      // IF statement with cross-sheet reference
      { 
        r: 1, 
        c: 0, 
        v: { 
          f: '=IF(Data!B1>1500,"High","Low")',
        //   m: 'Low'
        } 
      },
      // VLOOKUP across sheets
      { 
        r: 2, 
        c: 0, 
        v: { 
          f: '=VLOOKUP("Product A",Data!A1:B2,2,FALSE)',
          m: '1000'
        } 
      },
      // Multiple operations
      { 
        r: 3, 
        c: 0, 
        v: { 
          f: '=(Data!B1 + Data!B2) * 0.1',
          m: '300'
        } 
      },
    ],
  },
  ]);
  /**
   * 
   * Example formula to reference a cell from another sheet named 'Sales Data':
    {
        r: 0,
        c: 0,
        v: {
            f: "='Sales Data'!A1",  // Note the single quotes
            m: '100'
        }
    }
   */

  function createCrossSheetFormula(sourceSheet, cellRef, operation = null) {
  const baseFormula = `${sourceSheet}!${cellRef}`;
  
  if (operation) {
    return `=${operation}(${baseFormula})`;
  }
  
  return `=${baseFormula}`;
}

// Usage
const formula1 = createCrossSheetFormula('Sales', 'A1:A10', 'SUM');
// Result: =SUM(Sales!A1:A10)
console.log("Result: =SUM(Sales!A1:A10)-->",formula1);


const formula2 = createCrossSheetFormula('Revenue', 'B5');
// Result: =Revenue!B5
console.log("Revenue!B5-->",formula2);


  return (
    <div style={{ height: '600px' }}>
      <Workbook data={data} />
    </div>
  );
}

export default App;