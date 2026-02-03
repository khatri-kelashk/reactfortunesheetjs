import React, { useState, useRef, useCallback } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';

/**
 * API-Integrated Drill-Down Example
 * Features:
 * - Async data fetching
 * - Loading states
 * - Error handling
 * - Caching
 * - Real-world API integration pattern
 */

const APIDrillDown = () => {
  const workbookRef = useRef(null);
  
  // State management
  const [sheets, setSheets] = useState([createInitialSheet()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataCache, setDataCache] = useState(new Map());
  const [navigationStack, setNavigationStack] = useState([
    { level: 'summary', sheetIndex: 0, title: 'Sales Summary' }
  ]);

  // Create initial summary sheet
  function createInitialSheet() {
    return {
      name: 'Sales Summary',
      celldata: [
        // Header
        { r: 0, c: 0, v: { v: 'Region', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
        { r: 0, c: 1, v: { v: 'Total Sales', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
        { r: 0, c: 2, v: { v: 'Status', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
        { r: 0, c: 3, v: { v: 'Action', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
        
        // Loading message
        { r: 2, c: 0, v: { v: 'Loading data...', it: 1, fc: '#666666' } },
      ],
      config: {
        columnlen: { 0: 150, 1: 120, 2: 120, 3: 120 }
      }
    };
  }

  // Simulate API call to fetch summary data
  const fetchSummaryData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data (in real app, this would be an actual API call)
    return [
      { id: 1, region: 'North America', total: 1250000, stores: 25, status: 'Active' },
      { id: 2, region: 'Europe', total: 980000, stores: 18, status: 'Active' },
      { id: 3, region: 'Asia Pacific', total: 1560000, stores: 32, status: 'Active' },
      { id: 4, region: 'Latin America', total: 430000, stores: 12, status: 'Growing' },
    ];
  };

  // Simulate API call to fetch region details
  const fetchRegionDetails = async (regionId) => {
    // Check cache first
    if (dataCache.has(`region-${regionId}`)) {
      return dataCache.get(`region-${regionId}`);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock detailed data
    const detailsByRegion = {
      1: [ // North America
        { storeId: 101, name: 'NYC Flagship', sales: 125000, manager: 'John Smith', employees: 45 },
        { storeId: 102, name: 'LA Downtown', sales: 98000, manager: 'Sarah Johnson', employees: 38 },
        { storeId: 103, name: 'Chicago Central', sales: 87000, manager: 'Mike Davis', employees: 35 },
      ],
      2: [ // Europe
        { storeId: 201, name: 'London West End', sales: 145000, manager: 'Emma Wilson', employees: 42 },
        { storeId: 202, name: 'Paris Champs-Élysées', sales: 132000, manager: 'Pierre Dubois', employees: 40 },
        { storeId: 203, name: 'Berlin Mitte', sales: 98000, manager: 'Hans Mueller', employees: 36 },
      ],
      3: [ // Asia Pacific
        { storeId: 301, name: 'Tokyo Shibuya', sales: 178000, manager: 'Yuki Tanaka', employees: 48 },
        { storeId: 302, name: 'Singapore Orchard', sales: 165000, manager: 'Wei Chen', employees: 45 },
        { storeId: 303, name: 'Sydney CBD', sales: 143000, manager: 'James Lee', employees: 41 },
      ],
      4: [ // Latin America
        { storeId: 401, name: 'São Paulo', sales: 87000, manager: 'Carlos Silva', employees: 32 },
        { storeId: 402, name: 'Mexico City', sales: 76000, manager: 'Maria Garcia', employees: 28 },
        { storeId: 403, name: 'Buenos Aires', sales: 65000, manager: 'Diego Martinez', employees: 25 },
      ]
    };

    const data = detailsByRegion[regionId] || [];
    
    // Cache the result
    setDataCache(prev => new Map(prev).set(`region-${regionId}`, data));
    
    return data;
  };

  // Simulate API call to fetch store details
  const fetchStoreDetails = async (storeId) => {
    // Check cache
    if (dataCache.has(`store-${storeId}`)) {
      return dataCache.get(`store-${storeId}`);
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock store details
    const details = {
      storeId,
      metrics: [
        { metric: 'Daily Average Sales', value: 8500, unit: 'USD' },
        { metric: 'Customer Visits', value: 450, unit: 'per day' },
        { metric: 'Conversion Rate', value: 23.5, unit: '%' },
        { metric: 'Average Transaction', value: 187, unit: 'USD' },
      ],
      topProducts: [
        { name: 'Product A', sales: 45000, units: 340 },
        { name: 'Product B', sales: 38000, units: 290 },
        { name: 'Product C', sales: 32000, units: 245 },
      ]
    };

    setDataCache(prev => new Map(prev).set(`store-${storeId}`, details));
    return details;
  };

  // Initialize and load summary data
  React.useEffect(() => {
    loadSummaryData();
  }, []);

  const loadSummaryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchSummaryData();
      const summarySheet = createSummarySheetWithData(data);
      
      setSheets([summarySheet]);
    } catch (err) {
      setError('Failed to load summary data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create summary sheet with fetched data
  function createSummarySheetWithData(data) {
    const celldata = [
      // Headers
      { r: 0, c: 0, v: { v: 'Region', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 0, c: 1, v: { v: 'Total Sales', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 0, c: 2, v: { v: 'Stores', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 0, c: 3, v: { v: 'Status', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 0, c: 4, v: { v: 'Action', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
    ];

    // Add data rows
    data.forEach((item, index) => {
      const row = index + 1;
      celldata.push(
        { r: row, c: 0, v: { v: item.region, bl: 1 } },
        { r: row, c: 1, v: { v: item.total, ct: { fa: '$#,##0', t: 'n' }, m: `$${item.total.toLocaleString()}` } },
        { r: row, c: 2, v: { v: item.stores, ct: { fa: 'General', t: 'n' }, m: item.stores.toString() } },
        { r: row, c: 3, v: { v: item.status } },
        { 
          r: row, 
          c: 4, 
          v: { 
            v: '🔍 View Stores', 
            fc: '#0066CC', 
            un: 1,
            metadata: { regionId: item.id, regionName: item.region } // Store metadata
          } 
        }
      );
    });

    return {
      name: 'Sales Summary',
      celldata,
      config: {
        columnlen: { 0: 150, 1: 120, 2: 80, 3: 100, 4: 120 }
      }
    };
  }

  // Create region detail sheet
  function createRegionSheet(regionName, stores) {
    const celldata = [
      // Back button
      { r: 0, c: 0, v: { v: '⬅ Back to Summary', fc: '#0066CC', bl: 1, un: 1 } },
      
      // Title
      { r: 1, c: 0, v: { v: `${regionName} - Store Details`, bg: '#4472C4', fc: '#FFFFFF', bl: 1, fs: 14 } },
      
      // Headers
      { r: 3, c: 0, v: { v: 'Store Name', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 3, c: 1, v: { v: 'Sales', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 3, c: 2, v: { v: 'Manager', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 3, c: 3, v: { v: 'Employees', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 3, c: 4, v: { v: 'Action', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
    ];

    // Add store rows
    stores.forEach((store, index) => {
      const row = index + 4;
      celldata.push(
        { r: row, c: 0, v: { v: store.name, bl: 1 } },
        { r: row, c: 1, v: { v: store.sales, ct: { fa: '$#,##0', t: 'n' }, m: `$${store.sales.toLocaleString()}` } },
        { r: row, c: 2, v: { v: store.manager } },
        { r: row, c: 3, v: { v: store.employees } },
        { 
          r: row, 
          c: 4, 
          v: { 
            v: '📊 Details', 
            fc: '#0066CC', 
            un: 1,
            metadata: { storeId: store.storeId, storeName: store.name }
          } 
        }
      );
    });

    return {
      name: regionName,
      celldata,
      config: {
        columnlen: { 0: 180, 1: 120, 2: 150, 3: 100, 4: 100 }
      }
    };
  }

  // Create store detail sheet
  function createStoreSheet(storeName, details) {
    const celldata = [
      // Back button
      { r: 0, c: 0, v: { v: '⬅ Back', fc: '#0066CC', bl: 1, un: 1 } },
      
      // Title
      { r: 1, c: 0, v: { v: `${storeName} - Performance Metrics`, bg: '#4472C4', fc: '#FFFFFF', bl: 1, fs: 14 } },
      
      // Metrics section
      { r: 3, c: 0, v: { v: 'Key Metrics', bg: '#D9E1F2', bl: 1 } },
      { r: 4, c: 0, v: { v: 'Metric', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 4, c: 1, v: { v: 'Value', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: 4, c: 2, v: { v: 'Unit', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
    ];

    // Add metrics
    let currentRow = 5;
    details.metrics.forEach(metric => {
      celldata.push(
        { r: currentRow, c: 0, v: { v: metric.metric } },
        { r: currentRow, c: 1, v: { v: metric.value, bl: 1 } },
        { r: currentRow, c: 2, v: { v: metric.unit } }
      );
      currentRow++;
    });

    // Top products section
    currentRow += 2;
    celldata.push(
      { r: currentRow, c: 0, v: { v: 'Top Products', bg: '#D9E1F2', bl: 1 } },
      { r: currentRow + 1, c: 0, v: { v: 'Product', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: currentRow + 1, c: 1, v: { v: 'Sales', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } },
      { r: currentRow + 1, c: 2, v: { v: 'Units Sold', bg: '#4472C4', fc: '#FFFFFF', bl: 1 } }
    );

    currentRow += 2;
    details.topProducts.forEach(product => {
      celldata.push(
        { r: currentRow, c: 0, v: { v: product.name } },
        { r: currentRow, c: 1, v: { v: product.sales, ct: { fa: '$#,##0', t: 'n' }, m: `$${product.sales.toLocaleString()}` } },
        { r: currentRow, c: 2, v: { v: product.units } }
      );
      currentRow++;
    });

    return {
      name: storeName,
      celldata,
      config: {
        columnlen: { 0: 200, 1: 120, 2: 120 }
      }
    };
  }

  // Handle drill-down to region
  const drillDownToRegion = async (regionId, regionName) => {
    try {
      setLoading(true);
      setError(null);

      const stores = await fetchRegionDetails(regionId);
      const regionSheet = createRegionSheet(regionName, stores);
      
      setSheets([...sheets, regionSheet]);
      setNavigationStack(prev => [...prev, {
        level: 'region',
        sheetIndex: sheets.length,
        title: regionName,
        regionId
      }]);

    } catch (err) {
      setError('Failed to load region details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle drill-down to store
  const drillDownToStore = async (storeId, storeName) => {
    try {
      setLoading(true);
      setError(null);

      const details = await fetchStoreDetails(storeId);
      const storeSheet = createStoreSheet(storeName, details);
      
      setSheets([...sheets, storeSheet]);
      setNavigationStack(prev => [...prev, {
        level: 'store',
        sheetIndex: sheets.length,
        title: storeName,
        storeId
      }]);

    } catch (err) {
      setError('Failed to load store details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Navigate back
  const navigateBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(prev => prev.slice(0, -1));
      setSheets(prev => prev.slice(0, -1));
    }
  };

  // Handle cell clicks
  const handleCellClick = useCallback((row, col) => {
    const currentSheetIndex = navigationStack[navigationStack.length - 1].sheetIndex;
    const currentSheet = sheets[currentSheetIndex];
    const cell = currentSheet.celldata.find(c => c.r === row && c.c === col);
    
    if (!cell) return;
    
    const cellValue = cell.v?.v || '';
    const metadata = cell.v?.metadata;

    // Handle back button
    if (cellValue.includes('⬅ Back')) {
      navigateBack();
      return;
    }

    // Handle region drill-down
    if (cellValue === '🔍 View Stores' && metadata) {
      drillDownToRegion(metadata.regionId, metadata.regionName);
      return;
    }

    // Handle store drill-down
    if (cellValue === '📊 Details' && metadata) {
      drillDownToStore(metadata.storeId, metadata.storeName);
      return;
    }
  }, [sheets, navigationStack]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>API-Integrated Drill-Down</h2>
        
        {/* Navigation breadcrumb */}
        <div style={{
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <strong>Path:</strong>
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

        {/* Loading indicator */}
        {loading && (
          <div style={{
            padding: '10px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            ⏳ Loading data...
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            border: '1px solid #dc3545',
            borderRadius: '4px',
            marginBottom: '10px',
            color: '#721c24'
          }}>
            ❌ {error}
            <button
              onClick={() => setError(null)}
              style={{ marginLeft: '10px', cursor: 'pointer' }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Control buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            onClick={navigateBack}
            disabled={navigationStack.length <= 1 || loading}
            style={{
              padding: '8px 16px',
              backgroundColor: navigationStack.length > 1 ? '#4472C4' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: navigationStack.length > 1 && !loading ? 'pointer' : 'not-allowed'
            }}
          >
            ⬅ Back
          </button>

          <button
            onClick={loadSummaryData}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: loading ? '#ccc' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            🔄 Refresh
          </button>

          <button
            onClick={() => {
              setDataCache(new Map());
              loadSummaryData();
            }}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: loading ? '#ccc' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            🗑️ Clear Cache
          </button>
        </div>

        {/* Cache info */}
        <div style={{ fontSize: '12px', color: '#666' }}>
          Cached items: {dataCache.size} | Current level: {navigationStack[navigationStack.length - 1]?.level}
        </div>
      </div>

      <div style={{ height: '600px', border: '1px solid #ddd', opacity: loading ? 0.6 : 1 }}>
        <Workbook
          ref={workbookRef}
          data={sheets}
          onCellClick={(sheet, row, col) => handleCellClick(row, col)}
        />
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '4px' }}>
        <h3>API Integration Features:</h3>
        <ul>
          <li>✅ Async data fetching with loading states</li>
          <li>✅ Data caching to reduce API calls</li>
          <li>✅ Error handling and user feedback</li>
          <li>✅ Refresh functionality</li>
          <li>✅ Cache management</li>
          <li>✅ Metadata storage in cells for navigation</li>
        </ul>
        <p style={{ marginTop: '10px', fontStyle: 'italic', fontSize: '14px' }}>
          This example simulates API calls with delays. In production, replace the mock functions 
          with actual API calls to your backend.
        </p>
      </div>
    </div>
  );
};

export default APIDrillDown;