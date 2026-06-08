const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzk37Byg5gH_sEdtb9S0vnn2gzI1wRR8mdxJ5Pn8nNc8_wbewfMs0DU4qi-Y7xd-kyypg/exec';
 
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };
 
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
 
  try {
    let response;
    if (event.httpMethod === 'GET') {
      const action = event.queryStringParameters?.action || 'getAll';
      response = await fetch(`${SCRIPT_URL}?action=${action}`);
    } else if (event.httpMethod === 'POST') {
      const body = event.body;
      response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body
      });
    }
 
    const text = await response.text();
    return { statusCode: 200, headers, body: text };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
