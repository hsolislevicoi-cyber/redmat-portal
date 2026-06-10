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
      response = await fetch(`${SCRIPT_URL}?action=${action}`, {
        method: 'GET',
        redirect: 'follow'
      });
 
    } else if (event.httpMethod === 'POST') {
      // Google Apps Script needs the body as a URL-encoded form parameter
      // OR as raw text — we send as form data with 'data' key
      const rawBody = event.body || '{}';
      
      // Send as application/x-www-form-urlencoded so GAS receives it in e.postData
      const formData = new URLSearchParams();
      formData.append('data', rawBody);
 
      response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
        redirect: 'follow'
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
