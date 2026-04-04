import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import CreateEvent from './pages/CreateEvent'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto py-8 text-[var(--color-text-primary)]">
          <Routes>
            <Route path="/" element={<Events />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/:id" element={<EventDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
