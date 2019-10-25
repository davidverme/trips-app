const { providers } = require('./providers');
const { sendEmail } = require('./reporter');

const isMatch = (request, result) => (result < request.max);

const reportMatch = (provider, request, result) => {
  const destination = request.itinerary.map((item) => item.to).join(',');
  const dates = request.itinerary.map((item) => item.date).join(',');
  const url = provider.getResultUrl(request.itinerary);
  
  const text = `Pay $${result} for a trip with destination to ${destination} with dates ${dates}. LINK: ${url}. Email: ${request.client}`;
  console.log(`MATCH with ${provider.name} for ${request.description}!!!!`, text);
  
  sendEmail(request.client, 'We found a deal!!!', text);
};

const formatNumber = number => ("0" + number).slice(-2);

const addDaysToItinerary = (itinerary, days, index) => {
  const newItinerary = JSON.parse(JSON.stringify(itinerary));
  
  const newDate = new Date(itinerary[index].date);
  newDate.setDate(newDate.getDate() + days);
  
  const dateToUse = [
    newDate.getFullYear(),
    formatNumber(newDate.getMonth() + 1),
    formatNumber(newDate.getDate()),
  ].join('/');

  newItinerary[index].flexible = null;
  newItinerary[index].date = dateToUse;
  
  return newItinerary;
};

const getExtendedItineraries = (itinerary, nested) => {
  let result = [itinerary];
  
  itinerary.forEach((step, index) => {
    const flexible = step.flexible;
    if (flexible) {
      for (let i = 1; i <= flexible; i++) {
        const newItineraryUp = addDaysToItinerary(itinerary, i, index);
        result = result.concat(getExtendedItineraries(newItineraryUp));

        const newItineraryDown = addDaysToItinerary(itinerary, i * -1, index);
        result = result.concat(getExtendedItineraries(newItineraryDown));
      }
    }
  });
  
  return result.filter((itinerary, index) => 
    result.findIndex(toCompare => JSON.stringify(toCompare) === JSON.stringify(itinerary)) === index);
};

const processRequest = async (request) => {
  console.log('About to process request: ', request);
  
  const itineraries = getExtendedItineraries(request.itinerary);

  await Promise.all(providers.map((provider) => {
    itineraries.forEach(async (itinerary) => {
      const result = await provider.processItinerary(itinerary);
      console.log(`Processed:`);
      console.log('Request: ', request.description);
      console.log('Itinerary: ', itinerary);
      console.log('RESULT: $', result);

      if (isMatch(request, result)) {
        reportMatch(provider, request, result);
      }
    });
  }));
  
  console.log('Request processed with providers: ', providers.map(provider => provider.name).join(','));
};

module.exports = {
  processRequest,
};