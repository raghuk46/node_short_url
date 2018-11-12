import _ from 'lodash';

export default (err) => {
  const errors = [];
  _.map(err.errors, (item) => {
    const { message, path } = item;
    errors.push({ path, message });
  });

  return errors;
};
