const crypto = require('crypto');
const Stripe = require('stripe');
const { db, isFirebaseConfigured } = require('../config/firebase');

const REQUIRED_SITE_CONFIRMATION_ENV = ['STRIPE_SECRET_KEY', 'STRIPE_PRICE_ID'];
const REQUIRED_WEBHOOK_ENV_VARS = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_LENGTH = 120;

let stripeClient = null;
const processedEventIds = new Set();

const sanitize = (value, max) => {
  if (value == null) return '';
  const next = String(value).trim();
  return next.length > max ? next.slice(0, max) : next;
};

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured');
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
};

const getFrontendBaseUrl = (req) => {
  const configured = sanitize(process.env.FRONTEND_BASE_URL, 300);
  const origin = sanitize(req.get('origin'), 300);
  const candidate = configured || origin;
  if (!candidate) {
    throw new Error('FRONTEND_BASE_URL is required when request origin is unavailable');
  }
  return new URL(candidate).toString().replace(/\/$/, '');
};

const ensureRequiredEnv = (keys) => {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    const err = new Error(`Missing required environment variables: ${missing.join(', ')}`);
    err.statusCode = 500;
    throw err;
  }
};

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase().trim();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return defaultValue;
};

const createCheckoutSession = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      const err = new Error('Stripe is not configured');
      err.statusCode = 500;
      throw err;
    }
    const stripe = getStripeClient();

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const checkoutKind = sanitize(body.checkoutKind || 'site-confirmation', 48);
    const customerEmail = sanitize(body.email, MAX_EMAIL_LENGTH);
    const customerName = sanitize(body.name, MAX_NAME_LENGTH);
    const source = sanitize(body.source || 'site-confirmation', 64);
    const referenceId = crypto.randomUUID();
    const appBaseUrl = getFrontendBaseUrl(req);

    if (checkoutKind === 'asset-viewing') {
      if (!isFirebaseConfigured()) {
        return res.status(503).json({ success: false, message: 'Database is not configured' });
      }
      const assetId = sanitize(body.assetId, 128);
      if (!assetId) {
        return res.status(400).json({ success: false, message: 'assetId is required' });
      }

      const assetSnap = await db.collection('assets').doc(assetId).get();
      if (!assetSnap.exists) {
        return res.status(404).json({ success: false, message: 'Asset not found' });
      }
      const asset = assetSnap.data();
      if (!parseBoolean(asset.isSpecial, false)) {
        return res.status(400).json({ success: false, message: 'This listing does not require a viewing fee' });
      }
      const fee = Number(asset.viewingFeeAed);
      if (!Number.isFinite(fee) || fee <= 0) {
        return res.status(400).json({ success: false, message: 'Viewing fee is not set for this listing' });
      }
      const unitAmount = Math.round(fee * 100);
      if (!Number.isFinite(unitAmount) || unitAmount < 1) {
        return res.status(400).json({ success: false, message: 'Invalid viewing fee amount' });
      }

      const label = sanitize(asset.name || 'Property', 120);
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'aed',
              unit_amount: unitAmount,
              product_data: {
                name: `Listing access: ${label}`,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${appBaseUrl}/#property/${encodeURIComponent(assetId)}?unlock_session={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appBaseUrl}/#property/${encodeURIComponent(assetId)}`,
        customer_email: customerEmail || undefined,
        billing_address_collection: 'required',
        client_reference_id: referenceId,
        metadata: {
          checkoutKind: 'asset-viewing',
          assetId,
          source: sanitize(body.source || 'asset-viewing', 64),
          customer_name: customerName || '',
        },
        allow_promotion_codes: false,
        submit_type: 'pay',
        payment_method_types: ['card'],
      });

      return res.status(201).json({
        success: true,
        data: {
          url: session.url,
          sessionId: session.id,
        },
      });
    }

    ensureRequiredEnv(REQUIRED_SITE_CONFIRMATION_ENV);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${appBaseUrl}/#payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appBaseUrl}/#payment-cancelled`,
      customer_email: customerEmail || undefined,
      billing_address_collection: 'required',
      client_reference_id: referenceId,
      metadata: {
        checkoutKind: 'site-confirmation',
        source,
        customer_name: customerName || '',
      },
      allow_promotion_codes: false,
      submit_type: 'pay',
      payment_method_types: ['card'],
    });

    return res.status(201).json({
      success: true,
      data: {
        url: session.url,
        sessionId: session.id,
      },
    });
  } catch (error) {
    console.error('createCheckoutSession:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Unable to initialize payment',
    });
  }
};

const getCheckoutSession = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ success: false, message: 'Stripe is not configured' });
    }
    const stripe = getStripeClient();

    const sessionId = sanitize(req.params.sessionId, 255);
    if (!sessionId || !sessionId.startsWith('cs_')) {
      return res.status(400).json({ success: false, message: 'Invalid session id' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    return res.status(200).json({
      success: true,
      data: {
        id: session.id,
        status: session.status,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email || session.customer_email || null,
        checkoutKind: session.metadata?.checkoutKind || null,
        assetId: session.metadata?.assetId || null,
      },
    });
  } catch (error) {
    console.error('getCheckoutSession:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to verify payment session',
    });
  }
};

const handleWebhook = async (req, res) => {
  try {
    ensureRequiredEnv(REQUIRED_WEBHOOK_ENV_VARS);
    const stripe = getStripeClient();
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).send('Missing stripe-signature header');
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (processedEventIds.has(event.id)) {
      return res.status(200).json({ received: true, duplicate: true });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      if (isFirebaseConfigured()) {
        await db.collection('payments').doc(session.id).set(
          {
            id: session.id,
            eventId: event.id,
            checkoutKind: session.metadata?.checkoutKind || null,
            assetId: session.metadata?.assetId || null,
            source: session.metadata?.source || 'site-confirmation',
            status: session.status,
            paymentStatus: session.payment_status,
            amountTotal: session.amount_total,
            currency: session.currency,
            customerEmail: session.customer_details?.email || session.customer_email || null,
            clientReferenceId: session.client_reference_id || null,
            createdAt: new Date(),
          },
          { merge: true }
        );

        if (session.metadata?.checkoutKind === 'asset-viewing' && session.metadata?.assetId) {
          await db.collection('assetUnlocks').doc(session.id).set(
            {
              sessionId: session.id,
              assetId: session.metadata.assetId,
              paymentStatus: session.payment_status,
              customerEmail: session.customer_details?.email || session.customer_email || null,
              createdAt: new Date(),
            },
            { merge: true }
          );
        }
      }
    }

    processedEventIds.add(event.id);
    if (processedEventIds.size > 5000) {
      const first = processedEventIds.values().next().value;
      if (first) processedEventIds.delete(first);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
};

module.exports = {
  createCheckoutSession,
  getCheckoutSession,
  handleWebhook,
};
