const axios = require('axios');

async function testFetch() {
  try {
    const res = await axios.get('http://localhost:5031/api/user?PageNumber=1&PageSize=100');
    console.log("Response Type:", typeof res.data);
    
    let users = [];
    if (Array.isArray(res.data)) users = res.data;
    else if (res.data.items) users = res.data.items;
    else if (res.data.data) users = res.data.data;
    else if (res.data.$values) users = res.data.$values;
    
    console.log(`Found ${users.length} total users.`);
    
    const partners = users.filter(u => String(u.role).trim() === '2' || String(u.role).trim().toLowerCase() === 'partner');
    
    console.log(`Found ${partners.length} partner users.`);
    console.log(JSON.stringify(partners.map(p => ({ id: p.id, firstName: p.firstName, role: p.role })), null, 2));

  } catch (err) {
    console.error("Error fetching:", err.message);
  }
}

testFetch();
