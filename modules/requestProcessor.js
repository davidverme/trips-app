const { providers } = require('./providers');
const { sendEmail } = require('./reporter');

const isMatch = (request, result) => (result < request.max);

const reportMatch = (provider, request, result) => {
  const destination = request.itinerary.map((item) => item.to).join(',');
  const dates = request.itinerary.map((item) => item.date).join(',');
  const url = provider.getResultUrl(request.itinerary);
  
  const text = `Trip with destination to ${destination} with dates ${dates}. LINK: ${url}. Email: ${request.client}`;
  console.log(`MATCH with $${result}!!!!`, text);
  
  sendEmail(request.client, 'We found a deal!!!', text);
};

const processRequest = async (request) => {
  console.log('About to process request: ', request);
  
  await Promise.all(providers.map(async (provider) => {
    const result = await provider.processItinerary(request.itinerary);
    console.log('RESULT: ', result);
    if (isMatch(request, result)) {
      reportMatch(provider, request, result);
    }
  }));
  
  console.log('Request processed with providers: ', providers.map(provider => provider.name).join(','));
};

module.exports = {
  processRequest,
};