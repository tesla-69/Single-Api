const { GoogleAuth } = require('google-auth-library');

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: './firebase-key.json',
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();

  console.log('\n🔥 Your OAuth2 Bearer Token:\n');
  console.log(`Bearer ${tokenResponse.token}\n`);
}

getAccessToken();
