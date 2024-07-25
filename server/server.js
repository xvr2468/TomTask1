const express = require("express");
const { PORT = 5555, mongoDBURL } = require('./config');
const mongoose = require("mongoose");
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
	  origin: "*",
	}
  });



app.use(express.json());
app.use(cors());

let mentors = {}; // Track mentors for each code block
let students = {};

io.on('connection', (socket) => {
	socket.on('joinRoom', (blockName) => {
		socket.join(blockName);
	
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

  socket.on('codeChange', (code) => {
    console.log('Code change received:', code);
    socket.broadcast.emit('codeUpdate', code);
  });




  socket.on('leaveRoom', (blockName) => {
    socket.leave(blockName);

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

  socket.on('mentorExit', (blockName) => {
    if (mentors[blockName] === socket.id) {
      delete mentors[blockName];
      students[blockName] = [];
      io.to(blockName).emit('mentorLeft');
      io.to(blockName).emit('studentCount', 0);
    }
  });
});

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

app.get('/api/codeblock/:name', async (req, res) => {
  try {
    const codeBlock = await CodeBlock.findOne({ name: req.params.name });
    if (codeBlock) {
      res.json(codeBlock);
    } else {
      res.status(404).json({ error: 'Code block not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the code block' });
  }
});


