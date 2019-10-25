const config = require('config');
const { processRequest } = require('./requestProcessor');

const requests = config.requests;

const find = (isTest) => {
  console.log('About to start processing all requests', isTest ? 'TEST' : '');
  const currentTime = new Date().getTime();

  requests.forEach((request) => {
    if (request.active
    && (!request.expire
      || request.expire > currentTime)
    && (!isTest
      || request.test)) {
      processRequest(request);
    }
    
  })
};

module.exports = {
  find,
};