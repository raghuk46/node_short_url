import initServer from '../src/boot';

module.exports = async function () {
  await initServer(process.env.NODE_ENV);
};
