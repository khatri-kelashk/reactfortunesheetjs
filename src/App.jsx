import { Routes, Route, } from "react-router-dom";
// import { useState } from 'react';
// import AdvancedFortuneSheet from './components/AdvancedFortuneSheet';
// import FortuneSheetApp  from './components/FortuneSheetApp';
// import MySpreadsheet from './components/MySpreadsheet';
// import FortuneSheetExample from './components/FortuneSheetExample';
// import FortuneSheetExample from './components/FortuneSheet19jan26';
// import FortuneSheetExample from './components/MultiSheetCommunication/FortuneSheetBtnClickAPICall';
// import FortuneSheetExample from './components/MultiSheetCommunication/MultiSheetFormulaComplexCalc';
// import FortuneSheetExample from './components/MultiSheetCommunication/FormulaExecutionExample';
// import FortuneSheetExample from './components/SheetUndoRedo';
// import FortuneSheetExample from './components/DrillDownSheets/DrillDownFortuneSheet';
import FortuneSheetExample from './components/DrillDownSheets_2/DrilDownNewSheet';
import TextEditor from './pages/TextEditor';

function App() {

  return (
    <>
    <Routes>

     <Route path="/" element={<FortuneSheetExample />} />
     <Route path="/text-editor" element={<TextEditor />} />
    </Routes>
    </>
  )
}

export default App
