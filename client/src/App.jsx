import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lobby from './components/Lobby';
import EventLoopExplanation from './components/EventLoopExplanation';
import CallbackHell from './components/CallbackHell';
import Promises from './components/Promises';
import ES6Features from './components/ES6Features';

const App = () => {
  return (
    <Router> {/* Wrap the app with the Router component to enable routing */}
      <div className='App'>
        <Routes> {/* Define the different routes for the application */}
          <Route path="/" element={<Lobby />} /> {/* Route for the Lobby page */}
          <Route path="/codeblock/event-loop" element={<EventLoopExplanation />} /> {/* Route for the Event Loop Explanation page */}
          <Route path="/codeblock/callback-hell" element={<CallbackHell />} /> {/* Route for the Callback Hell page */}
          <Route path="/codeblock/promises" element={<Promises />} /> {/* Route for the Promises page */}
          <Route path="/codeblock/es6-features" element={<ES6Features />} /> {/* Route for the ES6 Features page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App; {/* Export the App component as the default export */}







