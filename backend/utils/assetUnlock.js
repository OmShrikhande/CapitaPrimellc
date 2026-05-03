const { getStripeClientOrNull } = require('./stripeClient');

/**
 * Confirms a Checkout Session unlocked full details for a special asset (server-side; never trust the client alone).
 */
const verifyAssetViewingUnlock = async (sessionId, assetId) => {
  if (!sessionId || !String(sessionId).startsWith('cs_')) return false;
  if (!assetId) return false;
  const stripe = getStripeClientOrNull();
  if (!stripe) return false;
  try {
    const session = await stripe.checkout.sessions.retrieve(String(sessionId));
    if (session.payment_status !== 'paid') return false;
    if (session.metadata?.checkoutKind !== 'asset-viewing') return false;
    if (String(session.metadata?.assetId || '') !== String(assetId)) return false;
    return true;
  } catch {
    return false;
  }
};

module.exports = { verifyAssetViewingUnlock };
