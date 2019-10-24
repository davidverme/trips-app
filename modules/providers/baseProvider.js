const config = require('config');
const currencies = config.currencies;

class BaseProvider {
  constructor(name) {
    this.name = name;
  }

  getResultUrl(itinerary) {
    throw new Error('Not implemented function');
  }

  async processItinerary(itinerary) {
    throw new Error('Not implemented function');
  }

  translateCurrency(value) {
    return value / currencies[this.currency];
  }
}

module.exports = {
  BaseProvider,
};