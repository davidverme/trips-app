const config = require('config');
const { processRequest } = require('./requestProcessor');

const requests = config.requests;

const find = () => {
  console.log('About to start processing all requests');
  const currentTime = new Date().getTime();

  requests.forEach((request) => {
    if (request.active
    && (!request.expire
      || request.expire > currentTime)) {
      processRequest(request);
    }
    
  })
};

module.exports = {
  find,
};