import Redis from 'ioredis';
import _ from 'lodash';

import ShortUrl from '../models/ShortUrl';

const validateShortCode = async (req, res) => {
  const { shortCode } = req.params;
  const { REDIS_HOST, REDIS_PORT } = process.env;
  const redis = new Redis(REDIS_HOST, REDIS_PORT);
  // let`s talk to redis log if have a log with our shortCode
  const originalUrl = await redis.get(shortCode);
  if (!_.isNull(originalUrl)) {
    res.redirect(originalUrl);
  } else {
    // may be redis key has been expired or shortCode doesn`t exists
    // let ask mongodb for confirmation
    const item = await ShortUrl.findOne({ shortCode });
    if (item) {
      res.redirect(item.originalUrl);
    } else {
      res.status(404).send('NOT FOUND');
    }
  }
};

export default validateShortCode;
