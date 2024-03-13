import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadFile from "./components/uploadFile";

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route 
          path="/upload"
          element={<UploadFile />}
        />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
