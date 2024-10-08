import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; // Correct path to Login component
import OneBoxScreen from './components/OneBoxScreen'; // Correct path to OneBoxScreen component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/ReachInbox-Assignment" element={<Login />} />
                <Route path="/ReachInbox-Assignment/onebox" element={<OneBoxScreen />} />
            </Routes>
        </Router>
    );
}

export default App;
