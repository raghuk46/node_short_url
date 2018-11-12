import { GraphQLServer } from 'graphql-yoga';
import helmet from 'helmet';
import Redis from 'ioredis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';

// establish the database connection based on env
import dbConnect from './config/db';
import generateSchema from './utils/generateSchema';
import validateShortCode from './routes/validateShortCode';

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (token != null) {
      const user = await verifyToken(token);
      req.user = user;
    } else {
      req.user = null;
    }
    return next();
  } catch (error) {
    throw error;
  }
}

export default async (env) => {
  // connect to database
  await dbConnect(env);

  const { REDIS_HOST, REDIS_PORT } = process.env;

  const redis = new Redis(REDIS_PORT, REDIS_HOST);

  const server = new GraphQLServer({
    schema: generateSchema(),
    context: ({ request }) => ({
      redis,
      url: `${request.protocol}://${request.get('host')}`,
      req: request,
    }),
  });

  // security feature
  server.express.use(helmet());

  // securtiy throtlling
  server.express.use(
    new RateLimit({
      store: new RateLimitRedis({
        client: redis,
      }),
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit IP to 100 requests per windowMs
      delayMs: 0, // disable delaying - full speed until the max limit is reached
    }),
  );

  // handle routes
  server.express.get('/inflate/:shortCode', validateShortCode);

  const options = {
    port: process.env.PORT,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground',
  };

  // Launch a GraphQl Server
  const app = await server.start({ ...options });

  /* eslint-disable no-console */
  console.log(`🚀  Server is running on localhost:${options.port}`);

  return app;
};
