"use strict";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Views
import HomeView from "./views/HomeView.tsx";

export default function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeView/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
};