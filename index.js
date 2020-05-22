const server = require('./server');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.listen(5000);