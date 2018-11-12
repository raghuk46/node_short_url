import NodeEnvironment from 'jest-environment-node';

module.exports = class MongoEnvironment extends NodeEnvironment {
  /* eslint-disable no-useless-constructor */
  constructor(config) {
    super(config);
  }

  async setup() {
    console.log('Setup MongoDB Test Environment');

    await super.setup();
  }

  async teardown() {
    console.log('Teardown MongoDB Test Environment');

    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
};
