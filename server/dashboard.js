const express = require('express');
const path = require('path');
// const fs = require('fs');
const fs = require('fs/promises');
const { exec } = require('child_process');

const app = express();
const PORT = 8080;
const ASSETS_DIR = 'dashboard';
const WORKSPACE_DIR = '../repos';

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the assets directory
app.use(express.static(path.join(__dirname, ASSETS_DIR)));

// POST endpoint to create a folder and run a command
app.post('/crete-repo', (req, res) => {
  const { name, defaultBranch } = req.query;
  console.log(req.query);

  console.table(req.query);

  if (!name) {
    return res.status(400).json({ error: 'Missing folderName or command' });
  }

  const branches = {
    '': 'main',
    main: 'main',
    master: 'master',
  };

  const branch = branches[defaultBranch] || 'main';

  const folderPath = `./repo/${name}.git`;

  createDirectory(folderPath)
    // .then(() => run(`cd papitas fritas`))
    // .then(() => run(``))
    .then(() => run(`cd ${folderPath}; git init --bare --shared `))
    // .then(() => fs.lstat(folderPath))
    .then((res) => console.log(res))
    .then(() => res.status(200).json({ success: true, repoName: `${name}.git` }))
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: 'Failed to create folder', message: err.message });
    });
});

app.get('/test', async (req, res) => {
  console.log(req.body);

  res.json({ success: true });
});

// Custom 404 handler
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, ASSETS_DIR, '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

async function createDirectory(dirPath) {
  return fs.mkdir(dirPath, { recursive: true });
}

function run(cmd) {
  console.log('runnung', cmd);
  return new Promise((resolve, reject) => {
    exec(cmd, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
