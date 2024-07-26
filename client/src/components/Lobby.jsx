import React from 'react';
import { Link } from 'react-router-dom';
import './Lobby.css'; 

const Lobby = () => {
  // Define the list of code blocks with their names and paths
  const codeBlocks = [
    { name: 'Event Loop Explanation', path: '/codeblock/event-loop' },
    { name: 'Callback Hell', path: '/codeblock/callback-hell' },
    { name: 'Promises', path: '/codeblock/promises' },
    { name: 'ES6 Features', path: '/codeblock/es6-features' }
  ];

  return (
    <div className='Lobby-container'> {/* Container for the Lobby */}
      <div className='Lobby'> {/* Inner Lobby content */}
        <h1>Choose code block</h1> {/* Title for the Lobby */}
        <ul>
          {codeBlocks.map((block, index) => (
            <li key={index}> {/* List item for each code block */}
              <Link to={block.path}>{block.name}</Link> {/* Link to the code block page */}
            </li>
          ))}
        </ul>
        <img src="/images/codeblocks1.png" alt="Code Block" /> {/* Image displayed below the list */}
      </div>
    </div>
  );
}

export default Lobby;



