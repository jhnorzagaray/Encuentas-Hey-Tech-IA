exports.handler = async function(event) {

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const TOKEN = process.env.AIRTABLE_TOKEN;
    const BASE  = process.env.AIRTABLE_BASE;
    const TABLE = process.env.AIRTABLE_TABLE;
    const body  = JSON.parse(event.body);

    const response = await fetch(
      `https://api.airtable.com/v0/${BASE}/${TABLE}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields: body.fields })
      }
    );

    const data = await response.json();

    return {
      statusCode: response.ok ? 200 : 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };

  } catch(err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.toString() })
    };
  }
};
