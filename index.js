require('dotenv').config();
const server = require('./server');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const PORT = process.env.PORT || 5000;

server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.listen(PORT);