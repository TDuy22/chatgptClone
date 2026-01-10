const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Demo collections stored in memory
const collections = [
  { id: 'col-articles', name: 'Tài liệu Marketing', description: 'Marketing assets and docs' },
  { id: 'col-research', name: 'Hồ sơ Kỹ thuật', description: 'Technical specs and papers' },
];

app.get('/api/collections', (req, res) => {
  res.json(collections);
});

// Simple chat endpoint that echoes payload and returns demo response
app.post('/api/chat', (req, res) => {
  const { collections: selected, content } = req.body || {};
  console.log('Received /api/chat payload:', req.body);

  // Simulate a response structure the frontend expects
  const response = {
    messageId: 'resp_1',
    sender: 'bot',
    timestamp: new Date().toISOString(),
    content: {
      blocks: [
        { type: 'markdown', body: `Echoing your question: ${content}` },
      ],
      sources: selected && selected.length && selected[0] !== '*' ? [{ id: 'src1', fileName: 'doc.pdf', pageNumber: 1, fileUrl: '#', snippet: 'Example snippet' }] : [],
    },
  };

  res.json(response);
});

const port = process.env.PORT || 4010;
app.listen(port, () => console.log(`Mock server running on http://localhost:${port}`));
