import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ConvexClientProvider } from './ConvexProvider.js';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExpenseSplitter from './pages/ExpenseSplitter';
import PersonalDrive from './pages/PersonalDrive';
import Memories from './pages/Memories';
import Schedule from './pages/Schedule';
import './App.css';

function App() {
  return (
    <ConvexClientProvider>
      <Router>
        <div className="App">
          <Navbar />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
                                   <Route path="/expense-splitter" element={<ExpenseSplitter />} />
                     <Route path="/personal-drive" element={<PersonalDrive />} />
                     <Route path="/memories" element={<Memories />} />
                     <Route path="/schedule" element={<Schedule />} />
            </Routes>
          </motion.div>
        </div>
      </Router>
    </ConvexClientProvider>
  );
}

export default App;
