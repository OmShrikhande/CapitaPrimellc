const { db, isFirebaseConfigured } = require('../config/firebase');

const toMillis = (v) => {
  if (!v) return 0;
  if (typeof v === 'string') {
    const t = Date.parse(v);
    return Number.isFinite(t) ? t : 0;
  }
  if (typeof v.toMillis === 'function') return v.toMillis();
  if (v instanceof Date) return v.getTime();
  if (typeof v._seconds === 'number') return v._seconds * 1000;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const serializeDoc = (doc) => {
  const raw = { id: doc.id, ...doc.data() };
  const createdAt = raw.createdAt;
  let createdAtIso = null;
  if (createdAt && typeof createdAt.toDate === 'function') {
    createdAtIso = createdAt.toDate().toISOString();
  } else if (createdAt instanceof Date) {
    createdAtIso = createdAt.toISOString();
  } else if (createdAt && typeof createdAt._seconds === 'number') {
    createdAtIso = new Date(createdAt._seconds * 1000).toISOString();
  }
  return { ...raw, createdAt: createdAtIso || raw.createdAt };
};

/**
 * @desc Recent Stripe payment records (from webhook → Firestore). Admin only.
 */
const listStripeActivity = async (req, res) => {
  try {
    if (!isFirebaseConfigured()) {
      return res.status(200).json({
        success: true,
        data: { payments: [], assetUnlocks: [], message: 'Firebase not configured' },
      });
    }

    const [paySnap, unlockSnap] = await Promise.all([
      db.collection('payments').limit(80).get(),
      db.collection('assetUnlocks').limit(80).get(),
    ]);

    const payments = paySnap.docs.map((d) => serializeDoc(d));
    payments.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

    const assetUnlocks = unlockSnap.docs.map((d) => serializeDoc(d));
    assetUnlocks.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

    return res.status(200).json({
      success: true,
      data: { payments, assetUnlocks },
    });
  } catch (error) {
    console.error('listStripeActivity:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to load payment activity',
    });
  }
};

module.exports = { listStripeActivity };
