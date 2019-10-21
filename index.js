const fetch = require('node-fetch');


const run = async () => {
  const result = await fetch('https://almundo.com.ar/flights/async/itineraries?from=COR,MIA&to=MIA,COR&date=2020-04-24,2020-05-06&adults=1')
  const data = await result.json();
  console.log(data.results.cheaper_cluster.price.total);
};

run();
