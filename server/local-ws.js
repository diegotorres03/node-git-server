const WebSocket = require('ws');
const sg = require('simple-git');
let git = sg.simpleGit({
  baseDir: '../remote-sample', //"../git-test",
});

// Create a WebSocket server instance
const wss = new WebSocket.Server({ port: 8000 });

async function routeMessage(message) {
  const jsonMessage = JSON.parse(message);
  console.log(jsonMessage.column);

  if(jsonMessage.action === 'set-local-path' && jsonMessage.path) {
    try {
      const newGit = sg.simpleGit({
        baseDir: jsonMessage.path,
      });
      console.log(`changing git path to ${jsonMessage.path}`)
      git = newGit
    } catch (error) {
      console.error(err)
    }
  }

  if (jsonMessage.column === 'todo') {
    await git.add('.');
    await git.commit('working on ' + jsonMessage.detail.name);
    await git.checkout('master');
  }

  if (jsonMessage.column === 'doing') {
    // pull, then new branch, then checkpoint tag
    await git.add('.');
    await git.commit(jsonMessage.detail.name);
    await git.pull();

    await git.checkout(jsonMessage.detail.name).catch((err) => {
      console.log('ERR:', err.message);
      return git.checkoutBranch(jsonMessage.detail.name, 'master');
    });
    console.log(await git.status());
  }

  if (jsonMessage.column === 'done') {
    await git.add('.');
    await git.commit(jsonMessage.detail.name + 'done');
    // await git.pull()
    // await git.push()
    console.log(await git.status());
    await git.checkout('master');
    await git.merge([jsonMessage.detail.name]);
    await git.branch(['-D', jsonMessage.detail.name]);
    await git.push('origin', 'master')
  }

}

// Event listener for when a client connects
wss.on('connection', (ws) => {
  console.log('New client connected');

  git.branch().then((branchInfo) => {
    // ws.send({ branchInfo });
    console.log('branchInfo', branchInfo);
    ws.send(JSON.stringify({type: 'branch-detected', detail: {name: branchInfo.current}}))
  });

  // Event listener for messages from the client
  ws.on('message', (message) => {
    console.log('Received message:', message.toString());

    routeMessage(message);
    // Echo the message back to the client
    ws.send(`Server received: ${message}`);
  });

  // Event listener for when a client disconnects
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Send a welcome message to the client
  ws.send('Welcome to the WebSocket server!');
});

console.log('WebSocket server is running on ws://localhost:8000');
