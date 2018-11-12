/* eslint-disable  global-require */
/* eslint-disable  import/no-dynamic-require */
import path from 'path';
import fs from 'fs';
import glob from 'glob';

import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

export default () => {
  const modulesPath = path.join(__dirname, '../modules');

  const typeDefs = glob
    .sync(`${modulesPath}/**/*.graphql`)
    .map(typeDef => fs.readFileSync(typeDef, { encoding: 'utf8' }));

  const resolvers = glob
    .sync(`${modulesPath}/**/resolvers.?s`)
    .map(resolver => require(resolver).resolvers);

  return makeExecutableSchema({
    typeDefs: mergeTypes(typeDefs),
    resolvers: mergeResolvers(resolvers),
  });
};
