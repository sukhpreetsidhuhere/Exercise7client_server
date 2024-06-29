import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import EditNote from './components/EditNote';

function App() {
    return (
        <div className="container">
            <header>
                <h1>Notes App</h1>
                <nav>                        
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                </nav>
                </header>
                <Routes>
                    <Route path="/about" element={<About />} />
                    <Route path="/note/:id" element={<EditNote />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            
        </div>
    );
}

export default App;
