import React, { useState } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';

function MultiSheetFormulaCalc() {
  const [data] = useState([
    {
      name: 'Sales',
      celldata: [
        { r: 0, c: 0, v: { v: 100, m: '100' } },
        { r: 1, c: 0, v: { v: 200, m: '200' } },
        { r: 2, c: 0, v: { v: 300, m: '300' } },
      ],
    },
    {
      name: 'Summary',
      celldata: [
        // Reference single cell from Sales sheet
        { 
          r: 0, 
          c: 0, 
          v: { 
            v: null,
            f: '=Sales!A1',
            m: '100'
          } 
        },
        // Sum range from Sales sheet
        { 
          r: 1, 
          c: 0, 
          v: { 
            v: null,
            f: '=SUM(Sales!A1:A3)',
            m: '600'
          } 
        },
        // Multiple sheet references
        { 
          r: 2, 
          c: 0, 
          v: { 
            v: null,
            f: '=Sales!A1 + Sales!A2',
            m: '300'
          } 
        },
      ],
    },
  ]);

  return (
    <div style={{ height: '600px' }}>
      <Workbook data={data} />
    </div>
  );
}

export default MultiSheetFormulaCalc;