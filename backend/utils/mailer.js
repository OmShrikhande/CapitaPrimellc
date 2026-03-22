const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
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

const isMailConfigured = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

/**
 * @param {{ to: string, subject: string, text: string, html?: string }} opts
 */
const sendMail = async (opts) => {
  const tx = getTransporter();
  if (!tx) {
    console.warn('📧 SMTP not configured; skipping email send');
    return { sent: false, reason: 'smtp_not_configured' };
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
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
