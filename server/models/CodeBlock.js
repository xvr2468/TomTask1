const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  initialCode: { type: String, required: true },
  solution: { type: String, required: true }
});

const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema);

module.exports = CodeBlock;