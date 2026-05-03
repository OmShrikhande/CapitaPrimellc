const Stripe = require('stripe');

let cachedClient = null;
let cachedKey = null;

/**
 * @returns {{ key: string } | { error: 'missing' | 'publishable' | 'invalid_prefix' }}
 */
const normalizeStripeSecret = () => {
  const raw = process.env.STRIPE_SECRET_KEY;
  if (raw == null || !String(raw).trim()) {
    return { error: 'missing' };
  }
  const key = String(raw).trim();
  if (key.startsWith('pk_')) {
    return { error: 'publishable' };
  }
  if (!key.startsWith('sk_')) {
    return { error: 'invalid_prefix' };
  }
  return { key };
};

const throwStripeConfig = (code) => {
  if (code === 'missing') {
    const err = new Error('Stripe is not configured: set STRIPE_SECRET_KEY in your host environment.');
    err.statusCode = 500;
    throw err;
  }
  if (code === 'publishable') {
    const err = new Error(
      'STRIPE_SECRET_KEY must be your secret key (sk_test_… or sk_live_…), not the publishable key (pk_…). Update Render env vars from https://dashboard.stripe.com/apikeys'
    );
    err.statusCode = 500;
    throw err;
  }
  const err = new Error('STRIPE_SECRET_KEY must start with sk_test_ or sk_live_.');
  err.statusCode = 500;
  throw err;
};

/** Stripe SDK instance for server-side Checkout, webhooks, session retrieval. Throws if misconfigured. */
const getStripeClient = () => {
  const norm = normalizeStripeSecret();
  if ('error' in norm) {
    throwStripeConfig(norm.error);
  }
  const { key } = norm;
  if (!cachedClient || cachedKey !== key) {
    cachedKey = key;
    cachedClient = new Stripe(key);
  }
  return cachedClient;
};

/** Same as getStripeClient but returns null when key missing or invalid (e.g. optional unlock verify). */
const getStripeClientOrNull = () => {
  const norm = normalizeStripeSecret();
  if ('error' in norm) return null;
  const { key } = norm;
  if (!cachedClient || cachedKey !== key) {
    cachedKey = key;
    cachedClient = new Stripe(key);
  }
  return cachedClient;
};

module.exports = { getStripeClient, getStripeClientOrNull, normalizeStripeSecret };
