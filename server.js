const express = require('express');
const bodyparser = require('body-parser');
const server = express();

server.use(bodyparser.json());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${new Date().toISOString()} ${req.method} to ${req.url}`);

  next();
}

module.exports = server;
