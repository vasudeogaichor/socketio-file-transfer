import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadFile from "./components/uploadFile";
import Login from "./components/auth/login";
import SignUp from './components/auth/signup';

function App() {
  return (
    <div className="App">
    <Router>
        <Routes>
          <Route
            path="/files"
            element={<UploadFile />}
          />

          <Route
            path="/"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<SignUp />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
