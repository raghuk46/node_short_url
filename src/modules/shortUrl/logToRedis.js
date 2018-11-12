const logToRedis = async (data, redis) => {
    const { shortCode, originalUrl } = data;
    await redis.set(shortCode, originalUrl, 'ex', 60 * 60 * 24 * 15);
}

export default logToRedis;