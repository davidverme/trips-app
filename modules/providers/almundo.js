const fetch = require('node-fetch');
const config = require('config');
const { BaseProvider } = require('./baseProvider');

const providerConfig = config.providers.almundo;

class AlmundoProvider extends BaseProvider {
  constructor(props) {
    super(props);
    
    this.currency = providerConfig.currency;
  }

  getResultUrl(itinerary) {
    const from = itinerary.map((item) => item.from).join(',');
    const to = itinerary.map((item) => item.to).join(',');
    const dates = itinerary.map((item) => item.date.replace(/\//g, '-')).join(',');

    return `${providerConfig.resultBaseUrl}?from=${from}&to=${to}&date=${dates}&adults=1`;
  }

  async processItinerary(itinerary) {
    const from = itinerary.map((item) => item.from).join(',');
    const to = itinerary.map((item) => item.to).join(',');
    const dates = itinerary.map((item) => item.date.replace(/\//g, '-')).join(',');
    
    const url = `${providerConfig.api.url}?from=${from}&to=${to}&date=${dates}&adults=1`;
    const result = await fetch(url);
    const data = await result.json();
    
    return this.translateCurrency(data.results.cheaper_cluster.price.total);
  }
}

const instance = new AlmundoProvider('AM');

module.exports = {
  instance,
};