"use strict";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Views
import HomeView from "./views/HomeView.tsx";
import SearchView from './views/SearchView.tsx';

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SearchView />} />
          <Route path='/dashboard' element={<HomeView />} />
        </Routes>
      </BrowserRouter>
    </>
  )
};