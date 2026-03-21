require('dotenv').config();
const admin = require('firebase-admin');
const { INITIAL_DATA } = require('../utils/initialData');

// Firebase configuration
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID || "capitaprimellc-1dcaa",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "261265d3b8760153b51495fc781f7caeeca5f3f0",
  private_key: (process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDJMoSvwK7Nerwv\n+Hnb/oOqcNr1j6g2CbTTDxUEv0099UU1dsLK9dhE5t5Lu9a/M9LfDc+Tly68sso0\n7aqSke8Iy9cPNvv3nOposLZ+FO/iJUAgGDmIz11ZoJCONe+ronmzGr8fH6L5FFLU\nppwjmVl1vGAd5JHKItOBAvNann5xsSgIUgdSfk7/JY77B1OHeICIx8X5iFHEziTX\nsEZxcwlg3t9QUp/3IlImKm1xChj0sgsK73tNVUGu/MjF8WkJu1py5RzMVv9mWNUT\n8zwzP5eYG3fB0rGEbLREUeQwJvUSA+VWih+5MPuVOCPDYbg110MWCNBlP7Zg9lsS\n86Kq1eglAgMBAAECggEAAPVjjoKrMogEmOgtYgzEzgTXj0fgCECK2l5vIE0p9IuU\nTTLfe5MxigPUxClFGvLUjw+xBD+Pgor4uGKzfKO+4il6dDAi6E/L59YdSyGd8CjZ\neTHwFZFpNpx3206orTl+LHkKLqnx0nXnXFJVr6Kqf76qYEw3YTKXWF89D1728B78\naz5cLeLzSnhW7yAisYXGD1nV0zDUYB/tLzQnRNj5KEI239fBFDSWpCWvh1C6xlDI\n61723EIJ0c+0mEIa3js3rYWPpzOd+zwtHsvkX22smU7Kt/IYiyWrkJGEStoY4xux\nCa+wjpSkLprwUyIeDQhua9rMhtqknYwMzGPDxYhpQQKBgQDsAxC3DKY0uWpJhn83\nd7jNjzsOmD6TyFSz6PwnQ5JqPVUJ6iavGFDxgFnAVC+W1ZYQ/7Rei7RNlZzvhN4G\nQVs+1j2Yz/wa3DWKStSlHCFL2MBFhhZLFA+7YvDPGypVoxJ2hdJrA+DeWjYeMuJn\nEIIUrUUaC6ubAZwEN438xVCABQKBgQDaPKSVrhxyNBskOSQl9kbjOCqmFg77px8G\nrQ2mYUAi0Nxzz8BTLp7xW6yX2WH9wLCmiEdplwy07RRNtbFp4te5Rhh9s/t4aB6S\nxJKTmkOGOJmDrFnbZ0BEFpQcu5JU7WqaiLw1DAFMOivB5Bex0018ArKecoc7cExr\nGnNDQ73hoQKBgQCzevVIL29qIyMoPQcb+IjqkiUYSUE1g6CenOy9M07ySigUfSPj\n/jr4HWKjt6HlNBKGZN8XE2kPo1qQb9ukqCkq1SRMxMZ06sgwng2uboEHvBMkC/+C\nIwR/vZNh/MeqDnRo/AXz6iQlFDeZqZqxREWYUdh+ISfknkm2j0UEWE2KvQKBgG6L\nm18Kg/RBeqIdo7brCjtcnxXkRJCqteeezzRBPMil/ZVYXfaEvhRKOKHuhlmQOqsQ\niwPsdI5NLSSz7XtSYa3C2PMLsUzriNkVY54K3Ttm/jQZoKanpYEX4syvIs+MN5yx\nuIwyWZHwQWwEixATlcNEZpAmOWQdXUg/bLVc4hkhAoGBAMqz0Lv91nhJmybjOGlq\nyCp0j18b2LROyDhc6K2wy5q2TVnd0xzBkYKZDFhBRY6iHMa4Zyh2pnwA/LWzfsKK\nWTBPPlRBRVhdYsa00tzRP41vgWz9HPcgiX1EkRDwQrWfZCoAm+iSMhUylfj2VrgJ\n56By/mDZSz2m/7ZZVMbJdwlW\n-----END PRIVATE KEY-----").replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@capitaprimellc-1dcaa.iam.gserviceaccount.com",
  client_id: process.env.FIREBASE_CLIENT_ID || "115317460288688641502",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40capitaprimellc-1dcaa.iam.gserviceaccount.com"
};

async function initializeContent() {
  try {
    console.log('🚀 Starting content initialization...');
    
    // Initialize Firebase
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();
    const contentRef = db.collection('content').doc('main');

    // Check if content already exists
    const contentDoc = await contentRef.get();
    
    if (contentDoc.exists) {
      console.log('ℹ️  Content already initialized. Updating with latest data...');
    } else {
      console.log('✓ Creating new content document...');
    }

    // Set content with merge option to preserve existing data
    await contentRef.set({
      ...INITIAL_DATA,
      updatedAt: new Date(),
      version: '1.0.0'
    }, { merge: true });

    console.log('✅ Content initialized successfully!');
    console.log('📊 Content summary:');
    console.log(`   - Properties: ${INITIAL_DATA.properties?.items?.length || 0}`);
    console.log(`   - Services: ${INITIAL_DATA.services?.items?.length || 0}`);
    console.log(`   - Testimonials: ${INITIAL_DATA.testimonials?.items?.length || 0}`);
    console.log(`   - Offers: ${INITIAL_DATA.offers?.items?.length || 0}`);
    console.log(`   - Stats: ${INITIAL_DATA.stats?.length || 0}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing content:', error.message);
    process.exit(1);
  }
}

initializeContent();
