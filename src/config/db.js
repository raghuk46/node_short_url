import mongoose from 'mongoose';

import config from './config';

export default (enviroment) => {
  // first build the enviroment config
  config(enviroment);

  const { DB_URL, DB_DEBUG_MODE } = process.env;

  mongoose.Promise = global.Promise;
  mongoose.set('debug', DB_DEBUG_MODE);

  try {
    mongoose.connect(
      DB_URL,
      { useNewUrlParser: true },
    );
  } catch (err) {
    mongoose.createConnection(DB_URL, { useNewUrlParser: true });
  }

  /* eslint-disable no-console */
  mongoose.connection
    .once('open', () => console.log('Database Connection Established'))
    .on('error', (e) => {
      throw e;
    });
};
