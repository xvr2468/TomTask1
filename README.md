# Online Coding Platform for JS Learning

## Description

This is an online coding platform designed to help Tom, a professional JS lecturer, follow his students' progress in their journey of becoming JS masters. The platform includes features for different code blocks such as "Event Loop Explanation," "Callback Hell," "Promises," and "ES6 Features." The first user to join a code block session becomes the mentor, while subsequent users become students. The platform supports real-time code updates and provides a solution-checking feature.

## Features

- **Lobby Page**: Contains a title "Choose code block" and a list of at least 4 items representing different code blocks. Clicking an item redirects users to the corresponding code block page.
- **Code Block Page**: 
  - Contains the title of the code block and a text editor with the initial template.
  - Displays the user's role (mentor/student).
  - The first user to join the page becomes the mentor; subsequent users are students.
  - If the mentor leaves, students are redirected to the lobby, and any written code is deleted.
  - The mentor sees the code block in a read-only mode.
  - Students can edit the code.
- **Real-time Code Updates**: Code changes are displayed in real-time using WebSockets.
- **Syntax Highlighting**: The code editor has syntax highlighting for JavaScript.
- **Student Count**: Displays the number of students in the room in real-time.

## Technology Stack

- **Frontend**: React, Vite, Prism.js for syntax highlighting.
- **Backend**: Node.js, Express, Socket.io.
- **Database**: MongoDB.
- **Hosting**: Vercel.

## Installation

### Prerequisites

- Node.js and npm installed.
- MongoDB database set up.
