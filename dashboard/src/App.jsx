import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div>
        <Routes>
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
            </>
        </Routes>
      </div>
    </Router>
  );
}

export default App
