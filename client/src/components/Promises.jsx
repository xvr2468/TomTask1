import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { useNavigate } from 'react-router-dom';

// Initial code (task) for the Promises page
const initialCode = `// Promises Task
// Create a function that returns a promise which resolves after 2 seconds and logs "Promise resolved!".
function createPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Promise resolved!');
    }, 2000);
  });
}

createPromise().then((message) => {
  console.log(message);
});`;

// Solution code for the Promises task
const solutionCode = `// Promises Solution
function createPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Promise resolved!');
    }, 2000);
  });
}

createPromise().then((message) => {
  console.log(message);
});`;

const socket = io('http://localhost:5555'); 

const Promises = () => {
  const [code, setCode] = useState(initialCode); // State to store the code
  const [role, setRole] = useState(''); // State to store the role (mentor/student)
  const [studentsCount, setStudentsCount] = useState(0); // State to store the number of students
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const blockName = 'promises'; // Explicitly set the block name for this component
    console.log(`Joining room: ${blockName}`);
    socket.emit('joinRoom', blockName); // Emit event to join room

    socket.on('connect', () => {
      console.log('Connected to server'); // Log when connected to the server
    });

    socket.on('role', (assignedRole) => {
      console.log(`Assigned role: ${assignedRole}`); // Log assigned role
      setRole(assignedRole); // Set the role
    });

    socket.on('updateCode', (updatedCode) => {
      console.log('Received code update:', updatedCode); // Log received code update
      setCode(updatedCode); // Update the code
    });

    socket.on('studentCount', (count) => {
      console.log(`Students count: ${count}`); // Log student count
      setStudentsCount(count); // Update the student count
    });

    socket.on('mentorLeft', () => {
      console.log('Mentor has left'); // Log when mentor leaves
      alert('Mentor has left the session. You will be redirected to the lobby.');
      setCode(initialCode); // Reset code
      navigate('/'); // Navigate to the lobby
    });

    socket.on('redirect', () => {
      console.log('Redirecting to lobby'); // Log redirect
      alert('Mentor has left the session. Redirecting to lobby.');
      setCode(initialCode); // Reset code
      navigate('/'); // Navigate to the lobby
    });

    // Clean up event listeners on component unmount
    return () => {
      console.log(`Leaving room: ${blockName}`); // Log leaving room
      socket.emit('leaveRoom', blockName); // Emit event to leave room
      socket.off('connect');
      socket.off('role');
      socket.off('updateCode');
      socket.off('studentCount');
      socket.off('mentorLeft');
      socket.off('redirect');
    };
  }, [navigate]); // Ensure this only runs when 'navigate' changes

  const handleCodeChange = (newCode) => {
    setCode(newCode); // Update the code state
    if (role === 'student') {
      console.log(`Emitting code change: ${newCode}`); // Log code change
      socket.emit('codeChange', { code: newCode, blockName: 'promises' }); // Emit code change event
    }

    // Check if the new code matches the solution
    if (newCode === solutionCode) {
      alert('😊 Correct solution!');
    }
  };

  const handleLeave = () => {
    const blockName = 'promises'; // Explicitly set the block name for this component
    console.log(`Leaving room: ${blockName}`); // Log leaving room
    socket.emit('leaveRoom', blockName); // Emit event to leave room
    if (role === 'mentor') {
      socket.emit('mentorExit', blockName); // Emit mentor exit event
    }
    navigate('/'); // Navigate to the lobby
  };

  //CODEBLOCK

  return (
    <div className='Promises'>
      <h1>Promises</h1>
      <p>Role: {role}</p>
      <p>Students in the room: {studentsCount}</p>
      {role === 'mentor' ? (
        <Editor
          value={code}
          highlight={code => highlight(code, languages.js, 'javascript')}
          padding={10}
          readOnly
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      ) : (
        <Editor
          value={code}
          onValueChange={handleCodeChange}
          highlight={code => highlight(code, languages.js, 'javascript')}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      )}
      <button onClick={handleLeave}>Leave to Lobby</button>
    </div>
  );
};

export default Promises;

