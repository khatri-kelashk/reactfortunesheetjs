import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';

/**
 * Advanced Multi-Level Drill-Down Implementation
 * Features:
 * - Multiple drill-down levels (Region → Store → Product)
 * - Breadcrumb navigation
 * - Sheet switching between levels
 * - Back navigation
 * - State persistence
 */

const AdvancedDrillDown = () => {
  const workbookRef = useRef(null);
  
  // Navigation state
  const [navigationStack, setNavigationStack] = useState([
    { level: 'summary', title: 'Sales Summary', sheetIndex: 0 }
  ]);

  // Complete hierarchical data structure
  const [dataHierarchy] = useState({
    regions: {
      'North': {
        total: 125000,
        stores: {
          'Store A': { sales: 45000, manager: 'John Smith', products: ['Laptops', 'Phones', 'Tablets'] },
          'Store B': { sales: 38000, manager: 'Jane Doe', products: ['Phones', 'Accessories', 'TVs'] },
          'Store C': { sales: 42000, manager: 'Bob Wilson', products: ['Laptops', 'Tablets', 'Watches'] },
        }
      },
      'South': {
        total: 98000,
        stores: {
          'Store D': { sales: 33000, manager: 'Alice Brown', products: ['Phones', 'Tablets', 'Cameras'] },
          'Store E': { sales: 35000, manager: 'Charlie Davis', products: ['Laptops', 'Phones', 'TVs'] },
          'Store F': { sales: 30000, manager: 'Eve Martinez', products: ['Accessories', 'Watches', 'Tablets'] },
        }
      },
      'East': {
        total: 156000,
        stores: {
          'Store G': { sales: 52000, manager: 'Frank Lee', products: ['Laptops', 'Phones', 'Tablets', 'TVs'] },
          'Store H': { sales: 54000, manager: 'Grace Kim', products: ['All Electronics'] },
          'Store I': { sales: 50000, manager: 'Henry Zhang', products: ['Laptops', 'Phones', 'Accessories'] },
        }
      },
      'West': {
        total: 143000,
        stores: {
          'Store J': { sales: 48000, manager: 'Ivy Chen', products: ['Phones', 'Tablets', 'Watches'] },
          'Store K': { sales: 47000, manager: 'Jack Thompson', products: ['Laptops', 'TVs', 'Cameras'] },
          'Store L': { sales: 48000, manager: 'Kelly White', products: ['All Categories'] },
        }
      }
    },
    products: {
      'Laptops': { unitPrice: 1200, avgMargin: 0.22 },
      'Phones': { unitPrice: 800, avgMargin: 0.28 },
      'Tablets': { unitPrice: 500, avgMargin: 0.25 },
      'TVs': { unitPrice: 1500, avgMargin: 0.18 },
      'Accessories': { unitPrice: 50, avgMargin: 0.45 },
      'Watches': { unitPrice: 300, avgMargin: 0.35 },
      'Cameras': { unitPrice: 900, avgMargin: 0.30 },
    }
  });

  // Sheet data state
  const [sheets, setSheets] = useState([
    createSummarySheet()
  ]);

  // Create summary sheet
  function createSummarySheet() {
    return {
      name: 'Sales Summary',
      color: '',
      index: 0,
      status: 1,
      order: 0,
      hide: 0,
      row: 20,
      column: 10,
      celldata: [
        // Header
        { r: 0, c: 0, v: { v: 'Region', ct: { fa: 'General', t: 'g' }, m: 'Region', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
        { r: 0, c: 1, v: { v: 'Total Sales', ct: { fa: 'General', t: 'g' }, m: 'Total Sales', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
        { r: 0, c: 2, v: { v: 'Stores', ct: { fa: 'General', t: 'g' }, m: 'Stores', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
        { r: 0, c: 3, v: { v: 'Action', ct: { fa: 'General', t: 'g' }, m: 'Action', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
        
        // Data rows
        { r: 1, c: 0, v: { v: 'North', ct: { fa: 'General', t: 'g' }, m: 'North', fc: '#0066CC', bl: 1 } },
        { r: 1, c: 1, v: { v: 125000, ct: { fa: '$#,##0', t: 'n' }, m: '$125,000' } },
        { r: 1, c: 2, v: { v: 3, ct: { fa: 'General', t: 'n' }, m: '3' } },
        { r: 1, c: 3, v: { v: '🔍 Drill Down', ct: { fa: 'General', t: 'g' }, m: '🔍 Drill Down', fc: '#0066CC', un: 1 } },
        
        { r: 2, c: 0, v: { v: 'South', ct: { fa: 'General', t: 'g' }, m: 'South', fc: '#0066CC', bl: 1 } },
        { r: 2, c: 1, v: { v: 98000, ct: { fa: '$#,##0', t: 'n' }, m: '$98,000' } },
        { r: 2, c: 2, v: { v: 3, ct: { fa: 'General', t: 'n' }, m: '3' } },
        { r: 2, c: 3, v: { v: '🔍 Drill Down', ct: { fa: 'General', t: 'g' }, m: '🔍 Drill Down', fc: '#0066CC', un: 1 } },
        
        { r: 3, c: 0, v: { v: 'East', ct: { fa: 'General', t: 'g' }, m: 'East', fc: '#0066CC', bl: 1 } },
        { r: 3, c: 1, v: { v: 156000, ct: { fa: '$#,##0', t: 'n' }, m: '$156,000' } },
        { r: 3, c: 2, v: { v: 3, ct: { fa: 'General', t: 'n' }, m: '3' } },
        { r: 3, c: 3, v: { v: '🔍 Drill Down', ct: { fa: 'General', t: 'g' }, m: '🔍 Drill Down', fc: '#0066CC', un: 1 } },
        
        { r: 4, c: 0, v: { v: 'West', ct: { fa: 'General', t: 'g' }, m: 'West', fc: '#0066CC', bl: 1 } },
        { r: 4, c: 1, v: { v: 143000, ct: { fa: '$#,##0', t: 'n' }, m: '$143,000' } },
        { r: 4, c: 2, v: { v: 3, ct: { fa: 'General', t: 'n' }, m: '3' } },
        { r: 4, c: 3, v: { v: '🔍 Drill Down', ct: { fa: 'General', t: 'g' }, m: '🔍 Drill Down', fc: '#0066CC', un: 1 } },
        
        // Total
        { r: 6, c: 0, v: { v: 'TOTAL', ct: { fa: 'General', t: 'g' }, m: 'TOTAL', bg: '#D9E1F2', bl: 1 } },
        { r: 6, c: 1, v: { v: 522000, ct: { fa: '$#,##0', t: 'n' }, m: '$522,000', bg: '#D9E1F2', bl: 1 } },
        { r: 6, c: 2, v: { v: 12, ct: { fa: 'General', t: 'n' }, m: '12', bg: '#D9E1F2', bl: 1 } },
      ],
      config: {
        columnlen: { 0: 120, 1: 120, 2: 80, 3: 120 }
      }
    };
  }

  // Create region detail sheet
  function createRegionSheet(regionName) {
    const region = dataHierarchy.regions[regionName];
    const stores = region.stores;
    
    const celldata = [
      // Back button
      { r: 0, c: 0, v: { v: '⬅ Back to Summary', ct: { fa: 'General', t: 'g' }, m: '⬅ Back to Summary', fc: '#0066CC', bl: 1, un: 1 } },
      
      // Title
      { r: 1, c: 0, v: { v: `${regionName} Region - Stores`, ct: { fa: 'General', t: 'g' }, m: `${regionName} Region - Stores`, bg: '#4472C4', fc: '#FFFFFF', bl: 1, fs: 14 } },
      
      // Headers
      { r: 3, c: 0, v: { v: 'Store Name', ct: { fa: 'General', t: 'g' }, m: 'Store Name', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 3, c: 1, v: { v: 'Sales', ct: { fa: 'General', t: 'g' }, m: 'Sales', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 3, c: 2, v: { v: 'Manager', ct: { fa: 'General', t: 'g' }, m: 'Manager', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 3, c: 3, v: { v: 'Products', ct: { fa: 'General', t: 'g' }, m: 'Products', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 3, c: 4, v: { v: 'Action', ct: { fa: 'General', t: 'g' }, m: 'Action', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
    ];

    // Add store rows
    let currentRow = 4;
    Object.entries(stores).forEach(([storeName, storeData]) => {
      celldata.push(
        { r: currentRow, c: 0, v: { v: storeName, ct: { fa: 'General', t: 'g' }, m: storeName, bl: 1 } },
        { r: currentRow, c: 1, v: { v: storeData.sales, ct: { fa: '$#,##0', t: 'n' }, m: `$${storeData.sales.toLocaleString()}` } },
        { r: currentRow, c: 2, v: { v: storeData.manager, ct: { fa: 'General', t: 'g' }, m: storeData.manager } },
        { r: currentRow, c: 3, v: { v: storeData.products.join(', '), ct: { fa: 'General', t: 'g' }, m: storeData.products.join(', ') } },
        { r: currentRow, c: 4, v: { v: '🔍 View Details', ct: { fa: 'General', t: 'g' }, m: '🔍 View Details', fc: '#0066CC', un: 1 } }
      );
      currentRow++;
    });

    return {
      name: `${regionName} Region`,
      color: '',
      index: sheets.length,
      status: 1,
      order: sheets.length,
      hide: 0,
      row: 20,
      column: 10,
      celldata,
      config: {
        columnlen: { 0: 120, 1: 120, 2: 150, 3: 200, 4: 120 }
      }
    };
  }

  // Create store detail sheet
  function createStoreSheet(regionName, storeName) {
    const storeData = dataHierarchy.regions[regionName].stores[storeName];
    
    const celldata = [
      // Back button
      { r: 0, c: 0, v: { v: `⬅ Back to ${regionName}`, ct: { fa: 'General', t: 'g' }, m: `⬅ Back to ${regionName}`, fc: '#0066CC', bl: 1, un: 1 } },
      
      // Title
      { r: 1, c: 0, v: { v: `${storeName} Details`, ct: { fa: 'General', t: 'g' }, m: `${storeName} Details`, bg: '#4472C4', fc: '#FFFFFF', bl: 1, fs: 14 } },
      
      // Store Info
      { r: 3, c: 0, v: { v: 'Manager:', ct: { fa: 'General', t: 'g' }, m: 'Manager:', bl: 1 } },
      { r: 3, c: 1, v: { v: storeData.manager, ct: { fa: 'General', t: 'g' }, m: storeData.manager } },
      
      { r: 4, c: 0, v: { v: 'Total Sales:', ct: { fa: 'General', t: 'g' }, m: 'Total Sales:', bl: 1 } },
      { r: 4, c: 1, v: { v: storeData.sales, ct: { fa: '$#,##0', t: 'n' }, m: `$${storeData.sales.toLocaleString()}` } },
      
      // Product Headers
      { r: 6, c: 0, v: { v: 'Product Category', ct: { fa: 'General', t: 'g' }, m: 'Product Category', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 6, c: 1, v: { v: 'Unit Price', ct: { fa: 'General', t: 'g' }, m: 'Unit Price', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 6, c: 2, v: { v: 'Avg Margin', ct: { fa: 'General', t: 'g' }, m: 'Avg Margin', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
    ];

    // Add product rows
    let currentRow = 7;
    storeData.products.forEach(productName => {
      const productData = dataHierarchy.products[productName] || { unitPrice: 0, avgMargin: 0 };
      celldata.push(
        { r: currentRow, c: 0, v: { v: productName, ct: { fa: 'General', t: 'g' }, m: productName } },
        { r: currentRow, c: 1, v: { v: productData.unitPrice, ct: { fa: '$#,##0', t: 'n' }, m: `$${productData.unitPrice.toLocaleString()}` } },
        { r: currentRow, c: 2, v: { v: productData.avgMargin, ct: { fa: '0.0%', t: 'n' }, m: `${(productData.avgMargin * 100).toFixed(1)}%` } }
      );
      currentRow++;
    });

    return {
      name: storeName,
      color: '',
      index: sheets.length,
      status: 1,
      order: sheets.length,
      hide: 0,
      row: 20,
      column: 10,
      celldata,
      config: {
        columnlen: { 0: 150, 1: 120, 2: 120 }
      }
    };
  }

  // Handle cell clicks
  const handleCellClick = useCallback((row, col) => {
    const currentSheet = sheets[navigationStack[navigationStack.length - 1].sheetIndex];
    const cell = currentSheet.celldata.find(c => c.r === row && c.c === col);
    
    if (!cell) return;
    
    const cellValue = cell.v?.v || '';
    
    // Check for drill-down action
    if (cellValue === '🔍 Drill Down') {
      // Get region name from same row, column 0
      const regionCell = currentSheet.celldata.find(c => c.r === row && c.c === 0);
      if (regionCell) {
        const regionName = regionCell.v?.v;
        drillDownToRegion(regionName);
      }
    }
    
    // Check for store detail action
    if (cellValue === '🔍 View Details') {
      const storeCell = currentSheet.celldata.find(c => c.r === row && c.c === 0);
      if (storeCell) {
        const storeName = storeCell.v?.v;
        const currentNav = navigationStack[navigationStack.length - 1];
        drillDownToStore(currentNav.regionName, storeName);
      }
    }
    
    // Check for back button
    if (cellValue.startsWith('⬅ Back')) {
      navigateBack();
    }
  }, [sheets, navigationStack]);

  // Drill down to region
  const drillDownToRegion = (regionName) => {
    const newSheet = createRegionSheet(regionName);
    const newSheets = [...sheets, newSheet];
    setSheets(newSheets);
    
    setNavigationStack(prev => [...prev, {
      level: 'region',
      title: `${regionName} Region`,
      sheetIndex: newSheets.length - 1,
      regionName
    }]);
  };

  // Drill down to store
  const drillDownToStore = (regionName, storeName) => {
    const newSheet = createStoreSheet(regionName, storeName);
    const newSheets = [...sheets, newSheet];
    setSheets(newSheets);
    
    setNavigationStack(prev => [...prev, {
      level: 'store',
      title: storeName,
      sheetIndex: newSheets.length - 1,
      regionName,
      storeName
    }]);
  };

  // Navigate back
  const navigateBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(prev => prev.slice(0, -1));
    }
  };

  // Get current sheet index
  const currentSheetIndex = navigationStack[navigationStack.length - 1]?.sheetIndex || 0;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Advanced Multi-Level Drill-Down</h2>
        
        {/* Breadcrumb Navigation */}
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <strong>Navigation:</strong>
          {navigationStack.map((nav, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>→</span>}
              <span style={{ 
                color: index === navigationStack.length - 1 ? '#0066CC' : '#666',
                fontWeight: index === navigationStack.length - 1 ? 'bold' : 'normal'
              }}>
                {nav.title}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={navigateBack}
            disabled={navigationStack.length <= 1}
            style={{
              padding: '8px 16px',
              backgroundColor: navigationStack.length > 1 ? '#4472C4' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: navigationStack.length > 1 ? 'pointer' : 'not-allowed'
            }}
          >
            ⬅ Back
          </button>
          
          <button 
            onClick={() => {
              setSheets([createSummarySheet()]);
              setNavigationStack([{ level: 'summary', title: 'Sales Summary', sheetIndex: 0 }]);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🏠 Reset to Home
          </button>
        </div>
      </div>

      <div style={{ height: '600px', border: '1px solid #ddd' }}>
        <Workbook
          ref={workbookRef}
          data={sheets}
          onChange={(data) => setSheets(data)}
          onCellClick={(sheet, row, col) => handleCellClick(row, col)}
        />
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '4px' }}>
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>✅ Multi-level drill-down (Summary → Region → Store)</li>
          <li>✅ Breadcrumb navigation showing current path</li>
          <li>✅ Back button functionality</li>
          <li>✅ Dynamic sheet creation</li>
          <li>✅ Click on "🔍 Drill Down" to navigate deeper</li>
          <li>✅ Navigation stack management</li>
        </ul>
        <p><strong>Current Level:</strong> {navigationStack[navigationStack.length - 1]?.level}</p>
      </div>
    </div>
  );
};

export default AdvancedDrillDown;