const nodemailer = require('nodemailer');

let transporter;

/**
 * Gmail: use GMAIL_USER + GMAIL_APP_PASSWORD (Google Account → Security → App passwords).
 * SMTP_* vars still work for other providers.
 */
const getTransporter = () => {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || (user && pass ? 'smtp.gmail.com' : null);

  if (!host || !user || !pass) return null;

  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
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
  return { sent: true };
};

module.exports = { sendMail, isMailConfigured };
