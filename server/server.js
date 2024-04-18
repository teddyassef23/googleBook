const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth'); 
const cors = require('cors');
const mongoose = require('mongoose');

async function startServer() {
  const app = express();

  app.use(express.json()); 
  app.use(express.urlencoded({ extended: true })); 
  app.use(cors()); 

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/googlebooks', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: req.user }), 
  });

  // app.use(authMiddleware);

  await server.start();

  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
});
