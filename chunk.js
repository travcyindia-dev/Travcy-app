const fs = require('fs');

// Read the already base64-encoded file (single line)
const keyBase64 = fs.readFileSync('firebase_base64.txt', 'utf-8').replace(/\n/g, ''); // remove any hidden newlines

const chunkSize = 500; // adjust as needed

for (let i = 0; i < keyBase64.length; i += chunkSize) {
  const partNumber = Math.floor(i / chunkSize) + 1;
  const chunk = keyBase64.slice(i, i + chunkSize);
  console.log(`FIREBASE_CHUNK_${partNumber}=${chunk}`);
}
