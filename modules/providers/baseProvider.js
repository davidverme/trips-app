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
}

module.exports = {
  BaseProvider,
};