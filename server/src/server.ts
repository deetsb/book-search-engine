import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas';
import { authMiddleware } from './services/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

async function startApolloServer() {
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: ({ req }) => authMiddleware({ req })
  });
  await server.start();
  server.applyMiddleware({ app });
}

db.once('open', async () => {
  await startApolloServer();
  app.listen(PORT, () =>
    console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`)
  );
});
