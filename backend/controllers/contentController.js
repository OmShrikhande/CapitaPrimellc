const { db, isFirebaseConfigured } = require('../config/firebase');
const { INITIAL_DATA } = require('../utils/initialData');

const CONTENT_DOC_ID = 'main';
const COLLECTION_NAME = 'content';

// Get all CMS content
const getContent = async (req, res) => {
  try {
    if (!isFirebaseConfigured()) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const doc = await db.collection(COLLECTION_NAME).doc(CONTENT_DOC_ID).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.json({ success: true, data: doc.data() });
  } catch (error) {
    console.error('Error getting content:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update all CMS content
const updateContent = async (req, res) => {
  try {
    if (!isFirebaseConfigured()) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const newData = req.body;
    await db.collection(COLLECTION_NAME).doc(CONTENT_DOC_ID).set({
      ...newData,
      updatedAt: new Date()
    }, { merge: true });

    res.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update a specific section of content (e.g., hero, stats)
const updateSection = async (req, res) => {
  try {
    const { section } = req.params;
    const sectionData = req.body;

    if (!isFirebaseConfigured()) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    await db.collection(COLLECTION_NAME).doc(CONTENT_DOC_ID).update({
      [section]: sectionData,
      updatedAt: new Date()
    });

    res.json({ success: true, message: `${section} updated successfully` });
  } catch (error) {
    console.error(`Error updating section ${req.params.section}:`, error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Helper for managing arrays (properties, offers, services, testimonials)
const updateArrayItem = async (req, res) => {
  try {
    const { type, index } = req.params;
    const itemData = req.body;

    if (!isFirebaseConfigured()) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const docRef = db.collection(COLLECTION_NAME).doc(CONTENT_DOC_ID);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const data = doc.data();
    const array = data[type] || [];
    
    if (index === 'add') {
      array.unshift(itemData); // Add to beginning like in CMSContext
    } else {
      const idx = parseInt(index);
      if (isNaN(idx) || idx < 0 || idx >= array.length) {
        return res.status(400).json({ success: false, message: 'Invalid index' });
      }
      array[idx] = itemData;
    }

    await docRef.update({
      [type]: array,
      updatedAt: new Date()
    });

    res.json({ success: true, message: `${type} updated successfully`, data: array });
  } catch (error) {
    console.error('Error updating array item:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteArrayItem = async (req, res) => {
  try {
    const { type, index } = req.params;

    if (!isFirebaseConfigured()) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const docRef = db.collection(COLLECTION_NAME).doc(CONTENT_DOC_ID);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const data = doc.data();
    const array = data[type] || [];
    const idx = parseInt(index);
    
    if (isNaN(idx) || idx < 0 || idx >= array.length) {
      return res.status(400).json({ success: false, message: 'Invalid index' });
    }

    array.splice(idx, 1);

    await docRef.update({
      [type]: array,
      updatedAt: new Date()
    });

    res.json({ success: true, message: `${type} deleted successfully`, data: array });
  } catch (error) {
    console.error('Error deleting array item:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Reset all content to default/initial state
const resetContent = async (req, res) => {
  try {
    if (!isFirebaseConfigured()) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    await db.collection(COLLECTION_NAME).doc(CONTENT_DOC_ID).set({
      ...INITIAL_DATA,
      updatedAt: new Date()
    });

    res.json({ 
      success: true, 
      message: 'All content reset to default state successfully',
      data: INITIAL_DATA
    });
  } catch (error) {
    console.error('Error resetting content:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getContent,
  updateContent,
  updateSection,
  updateArrayItem,
  deleteArrayItem,
  resetContent
};
