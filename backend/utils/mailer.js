const dns = require('dns');
const nodemailer = require('nodemailer');

let transporter;

/** Render and many clouds lack working IPv6 to smtp.gmail.com — ENETUNREACH on :: addresses. */
const smtpLookupIpv4 = (hostname, _options, callback) => {
  dns.lookup(hostname, { family: 4 }, callback);
};

const timeouts = () => ({
  connectionTimeout: parseInt(process.env.SMTP_CONNECTION_TIMEOUT_MS || '20000', 10),
  greetingTimeout: parseInt(process.env.SMTP_GREETING_TIMEOUT_MS || '20000', 10),
  socketTimeout: parseInt(process.env.SMTP_SOCKET_TIMEOUT_MS || '35000', 10),
});

/**
 * Gmail only: GMAIL_USER + GMAIL_APP_PASSWORD (Google Account → Security → App passwords).
 * Optional: explicit SMTP_HOST / SMTP_PORT for smtp.gmail.com (e.g. port 465) if you must override defaults.
 */
const getTransporter = () => {
  if (transporter) return transporter;

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const customHost = process.env.SMTP_HOST?.trim();

  const user = gmailUser || smtpUser;
  const pass = gmailPass || smtpPass;
  if (!user || !pass) return null;

  const preferIpv4 = process.env.SMTP_PREFER_IPV4 !== 'false';
  const lookupOpt = preferIpv4 ? { lookup: smtpLookupIpv4 } : {};
  const t = timeouts();

  // Preferred: app-password Gmail — Nodemailer "gmail" service (TLS to Google’s SMTP).
  const useGmailService =
    !customHost &&
    (!!gmailPass || /@(gmail|googlemail)\.com$/i.test(user));

  if (useGmailService) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      ...t,
      ...lookupOpt,
    });
    return transporter;
  }

  const host = customHost || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const isGmailHost = /gmail\.com/i.test(host);

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...t,
    ...lookupOpt,
    ...(isGmailHost && !secure ? { requireTLS: true } : {}),
  });
  return transporter;
};

const isMailConfigured = () => {
  const gmailOk = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
  const genericOk = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const implicitGmailOk = !!(process.env.SMTP_USER && process.env.SMTP_PASS && !process.env.SMTP_HOST);
  return gmailOk || genericOk || implicitGmailOk;
};

/**
 * @param {{ to: string, subject: string, text: string, html?: string }} opts
 */
const sendMail = async (opts) => {
  const tx = getTransporter();
  if (!tx) {
    console.warn('📧 Mail not configured; skipping email send');
    return { sent: false, reason: 'mail_not_configured' };
  }
  const from = process.env.SMTP_FROM || process.env.GMAIL_USER || process.env.SMTP_USER;
  await tx.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html || opts.text.replace(/\n/g, '<br/>'),
  });
  return { sent: true, via: 'smtp' };
};

module.exports = { sendMail, isMailConfigured };
