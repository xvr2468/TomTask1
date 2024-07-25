const { MongoClient } = require('mongodb'); 
const { mongoDBURL } = require('../server/config'); 

// Enable debug mode for MongoClient
const client = new MongoClient(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 60000, // Increase the server selection timeout
  socketTimeoutMS: 120000, // Increase the socket timeout
});

// Function to seed the database with initial code blocks
async function seedDatabase() {
  try {
    await client.connect(); // Connect to the MongoDB server
    console.log('Connected to MongoDB');

    const db = client.db('CodeBlockDB'); // Use the 'CodeBlockDB' database
    const collection = db.collection('codeblocks'); // Use the 'codeblocks' collection

    // Initial code blocks to be inserted into the database
    const initialCodeBlocks = [
      {
        name: 'Event Loop Explanation',
        initialCode: `// Event Loop Explanation\nconsole.log('This is the event loop');`,
        solution: `console.log('This is the event loop');`
      },
      {
        name: 'Callback Hell',
        initialCode: `// Callback Hell\nfunction doSomething(callback) {\n  setTimeout(() => {\n    console.log('Doing something...');\n    callback();\n  }, 1000);\n}`,
        solution: `function doSomething(callback) {\n  setTimeout(() => {\n    console.log('Doing something...');\n    callback();\n  }, 1000);\n}`
      },
      {
        name: 'Promises',
        initialCode: `// Promises\nfunction myPromise() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      resolve('Promise resolved!');\n    }, 1000);\n  });\n}`,
        solution: `function myPromise() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      resolve('Promise resolved!');\n    }, 1000);\n  });\n}`
      },
      {
        name: 'ES6 Features',
        initialCode: `// ES6 Features\nconst arrowFunction = () => {\n  console.log('Arrow function');\n};`,
        solution: `const arrowFunction = () => {\n  console.log('Arrow function');\n};`
      }
    ];

    console.log('Inserting initial code blocks...');
    // Insert each code block into the collection
    for (let block of initialCodeBlocks) {
      console.log(`Inserting block: ${block.name}`);
      await collection.insertOne(block); // Insert the code block into the collection
      console.log(`Inserted code block: ${block.name}`);
    }
    console.log('Initial code blocks inserted');
  } catch (error) {
    console.error('Error inserting initial code blocks', error); // Log any errors that occur during the insertion
  } finally {
    await client.close(); // Close the MongoDB client
  }
}

seedDatabase(); // Call the seedDatabase function to start the seeding process
