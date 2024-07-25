import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Lobby.css'; 

const Lobby = () => {
  const codeBlocks = [
    { name: 'Event Loop Explanation', path: '/codeblock/event-loop' },
    { name: 'Callback Hell', path: '/codeblock/callback-hell' },
    { name: 'Promises', path: '/codeblock/promises' },
    { name: 'ES6 Features', path: '/codeblock/es6-features' }
  ];

  return (
    <div className='Lobby-container'>
      <div className='Lobby'>
        <h1>Choose code block</h1>
        <ul>
          {codeBlocks.map((block, index) => (
            <li key={index}>
              <Link to={block.path}>{block.name}</Link>
            </li>
          ))}
        </ul>
        <img src="/images/codeblocks1.png" alt="Code Block" /> {/* Replace with the correct path to your image */}
      </div>
    </div>
  );
}

export default Lobby;


