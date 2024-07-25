const express = require("express"); 
const { PORT = 5555, mongoDBURL } = require('./config'); 
const mongoose = require("mongoose"); 
const cors = require('cors'); 
const http = require('http'); 
const { Server } = require("socket.io"); 
const path = require('path'); 
const codeBlocksConfig = require('./codeBlocksConfig.json'); 

const app = express(); // Initialize Express app
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (not recommended for production)
  }
});

app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Middleware to enable CORS

let mentors = {}; // Track mentors for each code block
let students = {}; // Track students for each code block

// Handle new socket connection
io.on('connection', (socket) => {
  // Handle joining a room
  socket.on('joinRoom', (blockName) => {
    socket.join(blockName); // Join the specified room

    // Assign roles and update counts
    if (!mentors[blockName]) {
      mentors[blockName] = socket.id;
      socket.emit('role', 'mentor');
    } else {
      if (!students[blockName]) {
        students[blockName] = [];
      }
      students[blockName].push(socket.id);
      socket.emit('role', 'student');
      io.to(blockName).emit('studentCount', students[blockName].length);
    }

    console.log(`Mentor connected: ${!!mentors[blockName]}, Students count: ${students[blockName] ? students[blockName].length : 0}`);
  });

  // Handle code changes
  socket.on('codeChange', (code) => {
    console.log('Code change received:', code);
    socket.broadcast.emit('codeUpdate', code); // Broadcast code change to other users
  });

  // Handle leaving a room
  socket.on('leaveRoom', (blockName) => {
    socket.leave(blockName);

    // Update mentor and student status
    if (socket.id === mentors[blockName]) {
      delete mentors[blockName];
      io.to(blockName).emit('mentorLeft');
      students[blockName] = [];
      io.to(blockName).emit('studentCount', 0);
    } else {
      if (students[blockName]) {
        students[blockName] = students[blockName].filter(id => id !== socket.id);
        io.to(blockName).emit('studentCount', students[blockName].length);
      }
    }

    console.log(`User disconnected, role: ${socket.id === mentors[blockName] ? 'mentor' : 'student'}`);
    console.log(`Mentor connected: ${!!mentors[blockName]}, Students count: ${students[blockName] ? students[blockName].length : 0}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    for (let blockName in students) {
      if (students[blockName].includes(socket.id)) {
        students[blockName] = students[blockName].filter(id => id !== socket.id);
        io.to(blockName).emit('studentCount', students[blockName].length);
      }
    }
    for (let blockName in mentors) {
      if (mentors[blockName] === socket.id) {
        delete mentors[blockName];
        io.to(blockName).emit('mentorLeft');
        students[blockName] = [];
        io.to(blockName).emit('studentCount', 0);
      }
    }
  });

  // Handle mentor exit
  socket.on('mentorExit', (blockName) => {
    if (mentors[blockName] === socket.id) {
      delete mentors[blockName];
      students[blockName] = [];
      io.to(blockName).emit('mentorLeft');
      io.to(blockName).emit('studentCount', 0);
    }
  });
});

// Endpoint to fetch code block by name
app.get('/api/codeblock/:name', (req, res) => {
  const blockName = req.params.name;
  const codeBlock = codeBlocksConfig[blockName];
  if (codeBlock) {
    res.json(codeBlock); // Respond with code block data if found
  } else {
    res.status(404).json({ error: 'Code block not found' }); // Respond with 404 if not found
  }
});

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('App connected to database');
    server.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Fallback to serve index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});







