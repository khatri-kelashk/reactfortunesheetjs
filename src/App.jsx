import { Routes, Route } from "react-router-dom";
// import { useState } from 'react';
// import FortuneSheetExample from './components/AdvancedFortuneSheet';
// import FortuneSheetApp  from './components/FortuneSheetApp';
// import MySpreadsheet from './components/MySpreadsheet';
// import FortuneSheetExample from './components/FortuneSheetExample';
// import FortuneSheetExample from './components/FortuneSheet19jan26_v3';
// import FortuneSheetExample from './components/MultiSheetCommunication/FortuneSheetBtnClickAPICall';
// import FortuneSheetExample from './components/MultiSheetCommunication/MultiSheetFormulaComplexCalc';
// import FortuneSheetExample from './components/MultiSheetCommunication/FormulaExecutionExample';
// import FortuneSheetExample from './components/SheetUndoRedo';
// import FortuneSheetExample from './components/DrillDownSheets/DrillDownFortuneSheet';
// import FortuneSheetExample from './components/DrillDownSheets_2/DrilDownNewSheet';
// import FortuneSheetExample from "./components/SheetRowsFocusInOut";
// import FortuneSheetExample from "./components/SheetRowsFocusInOut/ToolbarAndSheetTab";

// import FortuneSheetExample from './components/FreezeColumns';
// import FortuneSheetExample from './components/FreezeColumns/FreezeMiddleColumns';
// import FortuneSheetExample from './components/FreezeColumns/FreezColumns2';
// import FortuneSheetExample from './components/SheetRowsGrouping';
// import FortuneSheetExample from './components/QuotationForPDF';
import FortuneSheetExample from './components/QuotationForPDF/QuotePreview';
import TextEditor from "./pages/TextEditor";
// import CalendarComponent from "./components/ReactBigCalendar"; 
// import ANTDCalendarComponent from "./components/ANTDCalendar";
// import ANTDCalendarV2 from "./components/ANTDCalendar_V2/Scheduler/index";
// import ANTDCalendarV3Scheduler from "./components/ANTDCalendar_V3/index"
import ANTDCalendarV4Scheduler from "./components/ANTDCalendar_V4/index";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FortuneSheetExample />} />
        <Route path="/text-editor" element={<TextEditor />} />
        {/* <Route path="/calendar" element={<CalendarComponent />} /> */}
        {/* <Route path="/antd-calendar" element={<ANTDCalendarComponent />} /> */}
        {/* <Route path="/antd-calendar-v2" element={<ANTDCalendarV2 />} /> */}
        {/* <Route path="/antd-calendar-v3" element={<ANTDCalendarV3Scheduler />} /> */}
        <Route path="/antd-calendar-v4" element={<ANTDCalendarV4Scheduler />} />
      </Routes>
    </>
  );
}

export default App;
