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
          initialCode: "// Event Loop Task\n// Demonstrate the event loop by logging 'Start', then 'Promise', then 'End', and finally 'Timeout'\nconsole.log('Start');\n\nsetTimeout(() => {\n  console.log('Timeout');\n}, 0);\n\nPromise.resolve().then(() => console.log('Promise'));\n\nconsole.log('End');\n// Solution hint: Ensure the setTimeout and Promise are properly spaced\n// Remember to remove all comments for the solution",
          solution: "console.log('Start');\n\nsetTimeout(() => {\n  console.log('Timeout');\n}, 0);\n\nPromise.resolve().then(() => console.log('Promise'));\n\nconsole.log('End');"
        },
        {
          name: 'Callback Hell',
          initialCode: "// Callback Hell Task\n// Use nested callbacks to log 'Step 1', 'Step 2', and 'Step 3' in order\nfunction step1(callback) {\n  setTimeout(() => {\n    console.log('Step 1');\n    callback();\n  }, 500);\n}\n\nfunction step2(callback) {\n  setTimeout(() => {\n    console.log('Step 2');\n    callback();\n  }, 500);\n}\n\nfunction step3(callback) {\n  setTimeout(() => {\n    console.log('Step 3');\n    callback();\n  }, 500);\n}\n\n// Execute the steps in order using callbacks\n// Solution hint: Ensure the nested callback execution is properly spaced\n// Remember to remove all comments for the solution",
          solution: "function step1(callback) {\n  setTimeout(() => {\n    console.log('Step 1');\n    callback();\n  }, 500);\n}\n\nfunction step2(callback) {\n  setTimeout(() => {\n    console.log('Step 2');\n    callback();\n  }, 500);\n}\n\nfunction step3(callback) {\n  setTimeout(() => {\n    console.log('Step 3');\n    callback();\n  }, 500);\n}\n\nstep1(() => {\n  step2(() => {\n    step3(() => {\n      console.log('All steps completed');\n    });\n  });\n});"
        },
        {
          name: 'Promises',
          initialCode: "// Promises Task\n// Create a promise that resolves to 'Hello, World!' after 1 second\nfunction myPromise() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      resolve('Hello, World!');\n    }, 1000);\n  });\n}\n\n// Call myPromise and handle the resolved value\n// Solution hint: Ensure your final console log is on a separate line\n// Remember to remove all comments for the solution",
          solution: "function myPromise() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      resolve('Hello, World!');\n    }, 1000);\n  });\n}\n\nmyPromise().then(result => console.log(result));"
        },
        {
          name: 'ES6 Features',
          initialCode: "// ES6 Features Task\n// Create an arrow function that returns the square of a number and log the result for 3\nconst square = (x) => {\n  return x * x;\n};\n\n// Log the result for 3\n// Solution hint: Make sure your final console log is on a separate line\n// Remember to remove all comments for the solution",
          solution: "const square = (x) => {\n  return x * x;\n};\n\nconsole.log(square(3));"
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
