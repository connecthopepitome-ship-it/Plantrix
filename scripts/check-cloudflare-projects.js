const fs = require('fs');
const https = require('https');

const configPath = 'C:/Users/AU001AW7/AppData/Roaming/xdg.config/.wrangler/config/default.toml';

if (!fs.existsSync(configPath)) {
  console.log('Config path not found:', configPath);
  process.exit(1);
}

const content = fs.readFileSync(configPath, 'utf8');
const tokenMatch = content.match(/oauth_token\s*=\s*"([^"]+)"/);

if (!tokenMatch) {
  console.log('OAuth token not found in config');
  process.exit(1);
}

const token = tokenMatch[1];
const accountId = 'b598dd3391bac22fc46b65deb8839b4d';

function cfGet(endpoint) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${accountId}${endpoint}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('1. Checking Cloudflare Workers scripts...');
  const scriptsRes = await cfGet('/workers/scripts');
  if (scriptsRes && scriptsRes.result) {
    console.log('Found Workers:');
    scriptsRes.result.forEach(s => {
      console.log(` - ID: ${s.id}, modified_on: ${s.modified_on}`);
    });
  } else {
    console.log('Workers scripts response:', scriptsRes);
  }

  console.log('\n2. Checking Cloudflare Pages projects...');
  const pagesRes = await cfGet('/pages/projects');
  if (pagesRes && pagesRes.result) {
    console.log('Found Pages Projects:');
    pagesRes.result.forEach(p => {
      console.log(` - Name: ${p.name}, subDomain: ${p.sub_domain}, domains: ${JSON.stringify(p.domains)}`);
      if (p.latest_deployment) {
        console.log(`   Latest deployment: id=${p.latest_deployment.id}, status=${p.latest_deployment.status}, created_on=${p.latest_deployment.created_on}`);
      }
    });
  } else {
    console.log('Pages response:', pagesRes);
  }
}

run().catch(console.error);
