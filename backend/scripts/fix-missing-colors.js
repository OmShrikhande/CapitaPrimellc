const { db, isFirebaseConfigured } = require('../config/firebase');

const DEFAULT_THEME = {
  // Primary Palette - Main brand colors
  primary: '#C9A84C',
  primaryLight: '#E8D5A3',
  primaryDark: '#8B6B14',
  primaryMuted: '#6B5520',

  // Core colors for API compatibility
  secondary: '#0a0a0a',
  accent: '#ffffff',

  // Background Colors
  bgPrimary: '#060606',
  bgSecondary: '#0C0C0C',
  bgTertiary: '#111111',
  bgCard: '#0a0a0a',
  bgCardHover: 'rgba(16, 14, 10, 0.9)',

  // Text and Accent Colors
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textMuted: 'rgba(255, 255, 255, 0.28)',

  // Surface Colors
  surfaceGlass: 'rgba(255, 255, 255, 0.025)',
  surfaceGlassDark: 'rgba(6, 6, 6, 0.85)',
  surfaceBadge: 'rgba(6, 6, 6, 0.88)',

  // Border and Divider Colors
  borderPrimary: 'rgba(255, 255, 255, 0.07)',
  borderSecondary: 'rgba(255, 255, 255, 0.06)',
  borderAccent: 'rgba(201, 168, 76, 0.15)',
  borderGold: 'rgba(201, 168, 76, 0.3)',

  // Interactive State Colors
  hoverPrimary: 'rgba(201, 168, 76, 0.09)',
  hoverSecondary: 'rgba(201, 168, 76, 0.18)',
  focusRing: 'rgba(201, 168, 76, 0.05)',

  // Theme Mode
  mode: 'dark'
};

const fixMissingColors = async () => {
  if (!isFirebaseConfigured()) {
    console.log('⚠️ Firebase not configured, skipping color fix');
    return;
  }

  try {
    console.log('🔍 Checking all themes for missing colors...');

    // Get all themes
    const themesQuery = await db.collection('themes').get();
    const themes = themesQuery.docs;

    console.log(`📊 Found ${themes.length} theme documents`);

    let fixedCount = 0;

    for (const themeDoc of themes) {
      const themeData = themeDoc.data();
      const themeId = themeDoc.id;
      const themeName = themeData.name || 'unnamed';

      console.log(`🔍 Checking theme: ${themeName} (${themeId})`);

      // Check for missing colors
      const missingColors = [];
      const updates = {};

      for (const [key, defaultValue] of Object.entries(DEFAULT_THEME)) {
        if (!themeData.hasOwnProperty(key) || themeData[key] === undefined || themeData[key] === null) {
          missingColors.push(key);
          updates[key] = defaultValue;
        }
      }

      if (missingColors.length > 0) {
        console.log(`⚠️ Theme "${themeName}" missing ${missingColors.length} colors: ${missingColors.join(', ')}`);

        // Update the theme with missing colors
        updates.updatedAt = new Date();

        await themeDoc.ref.update(updates);
        fixedCount++;

        console.log(`✅ Fixed theme "${themeName}" - added ${missingColors.length} missing colors`);
      } else {
        console.log(`✅ Theme "${themeName}" has all colors`);
      }
    }

    console.log(`\n🎉 Color fix complete! Fixed ${fixedCount} out of ${themes.length} themes.`);

    if (fixedCount > 0) {
      console.log('\n📋 Summary of fixes:');
      console.log(`- ${fixedCount} themes were missing some colors and have been updated`);
      console.log(`- All themes now have complete color sets`);
    } else {
      console.log('\n✨ All themes already had complete color sets!');
    }

  } catch (error) {
    console.error('❌ Failed to fix missing colors:', error);
    process.exit(1);
  }
};

// Run the fix
fixMissingColors().then(() => {
  console.log('\n🏁 Missing colors fix operation completed');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Missing colors fix operation failed:', error);
  process.exit(1);
});