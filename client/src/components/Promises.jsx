import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5555'); // Ensure this matches your server URL and port

const Promises = () => {
  const [code, setCode] = useState('// Loading code...');
  const [solutionCode, setSolutionCode] = useState('');
  const [role, setRole] = useState('');
  const [studentsCount, setStudentsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const blockName = 'promises'; // Explicitly set the block name for this component

    // Fetch the initial code and solution from the server
    const fetchCodeBlock = async () => {
      try {
        const response = await fetch(`http://localhost:5555/api/codeblock/${blockName}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCode(data.initialCode);
        setSolutionCode(data.solutionCode);
      } catch (error) {
        console.error('Error fetching code block:', error);
      }
    };

    fetchCodeBlock();

    console.log(`Joining room: ${blockName}`);
    socket.emit('joinRoom', blockName);

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('role', (assignedRole) => {
      console.log(`Assigned role: ${assignedRole}`);
      setRole(assignedRole);
    });

    socket.on('updateCode', (updatedCode) => {
      console.log('Received code update:', updatedCode);
      setCode(updatedCode);
    });

    socket.on('studentCount', (count) => {
      console.log(`Students count: ${count}`);
      setStudentsCount(count);
    });

    socket.on('mentorLeft', () => {
      console.log('Mentor has left');
      alert('Mentor has left the session. You will be redirected to the lobby.');
      setCode('// Code reset due to mentor leaving...');
      navigate('/');
    });

    socket.on('redirect', () => {
      console.log('Redirecting to lobby');
      alert('Mentor has left the session. Redirecting to lobby.');
      setCode('// Code reset due to mentor leaving...');
      navigate('/');
    });

    // Clean up event listeners on component unmount
    return () => {
      console.log(`Leaving room: ${blockName}`);
      socket.emit('leaveRoom', blockName);
      socket.off('connect');
      socket.off('role');
      socket.off('updateCode');
      socket.off('studentCount');
      socket.off('mentorLeft');
      socket.off('redirect');
    };
  }, [navigate]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (role === 'student') {
      console.log(`Emitting code change: ${newCode}`);
      socket.emit('codeChange', { code: newCode, blockName: 'promises' });
    }

    if (newCode.trim() === solutionCode.trim()) {
      alert('😊 Correct solution!');
    }
  };

  const handleLeave = () => {
    const blockName = 'promises';
    console.log(`Leaving room: ${blockName}`);
    socket.emit('leaveRoom', blockName);
    if (role === 'mentor') {
      socket.emit('mentorExit', blockName);
    }
    navigate('/');
  };

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







