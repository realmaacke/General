import {BrowseRouter as Router, Routes, Route} from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<RefactoredDocsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
