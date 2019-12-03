const Promise = require('bluebird');

class FunctionContext {
  constructor(cb) {
    this.value = 200;
    this.cb = cb;
  }

  status(value) {
    this.value = value;
    return this;
  }

  succeed(value) {
    let err;
    this.cb(err, value);
  }
}

module.exports = (handler) => (gql) => (new Promise((resolve) => {
  const cb = (err, value) => resolve(value);
  const fnEvent = { body: gql };
  const fnContext = new FunctionContext(cb);
  handler(fnEvent, fnContext, cb);
}))
  .then((data) => {
    if (data.errors) {
      throw new Error(data.errors.map((v) => v.message).join('.\n'));
    }
    return data;
  });
