import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Interact from './pages/Interact'
import Customize from './pages/Customize'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interact" element={<Interact />} />
          <Route path="/customize" element={<Customize />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

