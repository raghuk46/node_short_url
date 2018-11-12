import mongoose from 'mongoose';

module.exports = async function () {
  console.log('Teardown Drop Test Database');

  const { DB_URL } = process.env;
  // Drop the Test database after all the test cases are executed
  await mongoose.connect(DB_URL);
  await mongoose.connection.dropDatabase();
  console.log('Test Database Dropped Succesfully');
};
