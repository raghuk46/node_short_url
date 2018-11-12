import Redis from 'ioredis';

const { REDIS_HOST, REDIS_PORT } = process.env;

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

export default redis;
