const { Git } = require('../dist');
// const { Git, GitOptions } = require('../src/git');

// const { join } = require("path");
const port =
  !process.env.PORT || isNaN(process.env.PORT)
    ? 3000
    : parseInt(process.env.PORT);

// const repos = new Git(join(__dirname, '../repo'), {
const repos = new Git('./path-to-repo', {
  autoCreate: true,
  // authenticate: ({ type, user }, next) =>{
  //   console.log('----')
  //   console.log('on auth', type, user)
  //   console.log('----')
  //   return  type == 'push'
  //     ? user(([username, password]) => {
  //       console.log('username', username)
  //       console.log('password', password.lenght)
  //         // aca puedo poner restricciones al accesso
  //         next();
  //       })
  //     : next()
  //   }
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

// console.log(repos.listen, port);

// repos.handle({ test: true });

/**
 * @typedef {Object} GitOptions
 * @property {boolean} [autoCreate] - Optional flag to automatically create something (specifics depend on implementation).
 * @property {function} [authenticate] - Optional authentication function.
 * @property {boolean} [checkout] - Optional flag to perform a checkout operation.
 */

/**
 * @callback AuthenticateCallback
 * @param {Error} [error] - Optional error object if authentication fails.
 * @returns {void}
 */

/**
 * @typedef {Object} GitAuthenticateOptions
 * @property {string} [repo] - The repository name or path.
 * @property {string} [user] - The username for authentication.
 * @property {string} [pass] - The password or token for authentication.
 */

/**
 * @callback AuthenticateFunction
 * @param {GitAuthenticateOptions} options - Options for authentication.
 * @param {AuthenticateCallback} callback - Callback function to handle authentication result.
 * @returns {void|Promise<Error|undefined|void>}
 */
