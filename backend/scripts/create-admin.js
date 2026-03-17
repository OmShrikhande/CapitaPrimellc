require('dotenv').config();
const bcrypt = require('bcryptjs');
const { db, isFirebaseConfigured } = require('../config/firebase');

async function createAdmin() {
  try {
    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      console.error('❌ Firebase is not configured. Please check your environment variables.');
      process.exit(1);
    }

    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.log('Usage: node scripts/create-admin.js <email> <password>');
      console.log('Example: node scripts/create-admin.js admin@capitaprimellc.com mypassword123');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await db.collection('admins').where('email', '==', email).limit(1).get();

    if (!existingAdmin.empty) {
      console.log('❌ Admin user with this email already exists.');
      process.exit(1);
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin document
    await db.collection('admins').add({
      email: email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      active: true
    });

    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log('🔑 Password: [HIDDEN - Use the password you provided]');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();