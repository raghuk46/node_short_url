import fs from 'fs';
import dotenv from 'dotenv';
import 'dotenv/config';
import _ from 'lodash';

const config = (enviroment) => {
  if (enviroment !== 'production') {
    const loadEnvFile = `${process.env.PWD}/.env.${enviroment}`;
    const envConfig = dotenv.parse(fs.readFileSync(loadEnvFile));

    _.mapKeys(envConfig, (v, k) => {
      process.env[k] = v;
    });
  }

  return process.env;
};

export default config;
