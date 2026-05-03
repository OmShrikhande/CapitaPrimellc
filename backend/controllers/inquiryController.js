const { db, isFirebaseConfigured } = require('../config/firebase');
const { sendMail } = require('../utils/mailer');

const NOTIFY_DEFAULT = 'capitaprimellc@gmail.com';

const MAX_LEN = {
  name: 120,
  email: 254,
  phone: 40,
  type: 64,
  budget: 64,
  message: 8000,
  source: 32,
};

const sanitize = (v, max) => {
  if (v == null) return '';
  const s = String(v).trim();
  return s.length > max ? s.slice(0, max) : s;
};

// @route POST /api/inquiries
const createInquiry = async (req, res) => {
  try {
    if (!isFirebaseConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Database is not configured',
      });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    // Honeypot must stay empty; trim so whitespace-only counts as empty (avoids false positives from autofill).
    if (body.hp_field != null && String(body.hp_field).trim() !== '') {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    const name = sanitize(body.name, MAX_LEN.name);
    const email = sanitize(body.email, MAX_LEN.email);
    const phone = sanitize(body.phone, MAX_LEN.phone);
    const type = sanitize(body.type, MAX_LEN.type);
    const budget = sanitize(body.budget, MAX_LEN.budget);
    const message = sanitize(body.message, MAX_LEN.message);
    const source = sanitize(body.source || 'contact', MAX_LEN.source);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const doc = {
      name,
      email,
      phone,
      type,
      budget,
      message,
      source,
      createdAt: new Date(),
      read: false,
    };

    const ref = await db.collection('inquiries').add(doc);

    const notifyTo = process.env.INQUIRY_NOTIFY_EMAIL || NOTIFY_DEFAULT;
    const lines = [
      `New inquiry from ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Source: ${source}`,
      type ? `Interest: ${type}` : null,
      budget ? `Budget: ${budget}` : null,
      '',
      message,
    ].filter(Boolean);

    try {
      await sendMail({
        to: notifyTo,
        subject: `[Capita Prime] Inquiry from ${name}`,
        text: lines.join('\n'),
      });
    } catch (mailErr) {
      console.error('Inquiry email failed:', mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you — we will contact you shortly.',
      data: { id: ref.id },
    });
  } catch (error) {
    console.error('createInquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not submit inquiry. Please try again later.',
    });
  }
};

// @route GET /api/admin/inquiries
const listInquiries = async (req, res) => {
  try {
    if (!isFirebaseConfigured()) {
      return res.status(503).json({ success: false, message: 'Database is not configured' });
    }

    let snapshot;
    try {
      snapshot = await db.collection('inquiries').orderBy('createdAt', 'desc').limit(200).get();
    } catch {
      snapshot = await db.collection('inquiries').limit(200).get();
    }

    const items = [];
    snapshot.forEach((d) => {
      const row = d.data();
      items.push({
        id: d.id,
        ...row,
        createdAt: row.createdAt?.toDate
          ? row.createdAt.toDate().toISOString()
          : row.createdAt,
      });
    });

    items.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });

    return res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('listInquiries:', error);
    return res.status(500).json({ success: false, message: 'Failed to load inquiries' });
  }
};

module.exports = { createInquiry, listInquiries };
