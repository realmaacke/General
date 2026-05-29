import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Suspense, lazy } from "react";

import { useState } from 'react'

// Lazy import to prevent prematrue initializations.
const Dashboard = lazy(() => import("./models/Dashboard"));
const Movies = lazy(() => import ("./models/Movies"));
const Series = lazy(() => import("./models/Series"));
const Channels = lazy(() => import("./models/Channels"));

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/movies" element={<Movies/>} />
          <Route path="/series" element={<Series/>} />
          <Route path="/channels" element={<Channels/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
