import nodemailer from "nodemailer";

export const cleanEnvValue = (value?: string) => (value || "").trim().replace(/^(["'])(.*)\1$/, "$2").trim();

export function mailTransport() {
  const host = cleanEnvValue(process.env.SMTP_HOST), user = cleanEnvValue(process.env.SMTP_USER), pass = cleanEnvValue(process.env.SMTP_PASS);
  if (!host || !user || !pass) return null;
  const port = Number(cleanEnvValue(process.env.SMTP_PORT) || "587");
  if (!Number.isInteger(port) || port < 1 || port > 65535) return null;
  return {
    sender: user,
    recipient: cleanEnvValue(process.env.CONTACT_NOTIFICATION_EMAIL) || "contact@arisestudio.com",
    transporter: nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass }, connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 8000 }),
  };
}
