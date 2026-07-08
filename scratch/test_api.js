const axios = require('axios');

const API_BASE = 'https://scorecard-production-e741.up.railway.app/api/conrad';
const API_KEY  = '6cefbca609d6f935f9ff82ad234435c90eca70a0d8e46c6b1e6a151438faa93a';

async function test() {
  try {
    const res = await axios.get(`${API_BASE}/percentile`, {
      headers: { 'x-api-key': API_KEY }
    });
    console.log(Object.keys(res.data));
  } catch (e) {
    console.error(e.message);
  }
}

test();
