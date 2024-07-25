import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lobby from './components/Lobby';
import EventLoopExplanation from './components/EventLoopExplanation';
import CallbackHell from './components/CallbackHell';
import Promises from './components/Promises';
import ES6Features from './components/ES6Features';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/codeblock/event-loop" element={<EventLoopExplanation />} />
          <Route path="/codeblock/callback-hell" element={<CallbackHell />} />
          <Route path="/codeblock/promises" element={<Promises />} />
          <Route path="/codeblock/es6-features" element={<ES6Features />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;






