const { Git } = require('../dist');

// const { join } = require("path");
const port =
  !process.env.PORT || isNaN(process.env.PORT)
    ? 3000
    : parseInt(process.env.PORT);

// const repos = new Git(join(__dirname, '../repo'), {
const repos = new Git('./repo', {
  autoCreate: true,
});

repos.on('push', (push) => {
  console.log(`push ${push.repo}/${push.commit} ( ${push.branch} )`);
  push.accept();
});

repos.on('pull', (pull) => {
  console.log(`pull ${pull.repo}/${pull.commit} ( ${pull.branch} )`);
  pull.accept();
});

repos.on('fetch', (fetch) => {
  console.log(`fetch ${fetch.commit}`);
  fetch.accept();
});

repos.listen(port, {}, () => {
  console.log(`node-git-server running at http://localhost:${port}`);
});

console.log(repos.listen, port);

// repos.handle({ test: true });
