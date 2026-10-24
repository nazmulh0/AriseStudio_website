import { getDatabase } from "./turso";
import { mailTransport } from "./mail";
import { appointmentSiteUrl } from "./appointmentEmail";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

export async function sendContactNotification(id: number): Promise<boolean> {
  const mail = mailTransport();
  if (!mail) return false;
  const db = await getDatabase();
  const claim = await db.execute({ sql: "UPDATE contact_notification_delivery SET claimUntil = ? WHERE leadId = ? AND sentAt IS NULL AND claimUntil <= ? RETURNING leadId", args: [Date.now() + 90000, id, Date.now()] });
  if (!claim.rows.length) {
    const saved = await db.execute({ sql: "SELECT sentAt FROM contact_notification_delivery WHERE leadId = ?", args: [id] });
    return Boolean(saved.rows[0]?.sentAt);
  }
  try {
    const rows = await db.execute({ sql: "SELECT submission FROM contact_leads WHERE id = ?", args: [id] });
    const leadData: Record<string, string> = JSON.parse(String(rows.rows[0].submission));
    const origin = appointmentSiteUrl();
const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #10b981; border-radius: 8px; background-color: #09101d; color: #f8fafc;">
    <div style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #1e293b;">
      <a href="${origin}" style="display:inline-block;"><img src="${origin}/brand/arisestudio-logo-white.png" alt="AriseStudio" width="148" style="display:block;width:148px;height:auto;border:0;"></a>
    </div>
    <h2 style="color: #10b981; margin-bottom: 16px;">🚀 New Consultation Lead | AriseStudio</h2>
    <p style="font-size: 14px; color: #94a3b8;">A new consultation request was submitted through the website.</p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 10px; color: #a7f3d0; font-weight: bold; width: 140px;">Full Name:</td>
        <td style="padding: 10px; color: #ffffff;">${escapeHtml(leadData.name)}</td>
      </tr>
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 10px; color: #a7f3d0; font-weight: bold;">Email:</td>
        <td style="padding: 10px; color: #ffffff;"><a href="mailto:${encodeURIComponent(leadData.email)}" style="color: #38bdf8;">${escapeHtml(leadData.email)}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 10px; color: #a7f3d0; font-weight: bold;">Phone / WhatsApp:</td>
        <td style="padding: 10px; color: #ffffff;">${escapeHtml(leadData.phone)}</td>
      </tr>
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 10px; color: #a7f3d0; font-weight: bold;">Company:</td>
        <td style="padding: 10px; color: #ffffff;">${escapeHtml(leadData.company)}</td>
      </tr>
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 10px; color: #a7f3d0; font-weight: bold;">Service Needed:</td>
        <td style="padding: 10px; color: #ffffff;">${escapeHtml(leadData.service)}</td>
      </tr>
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 10px; color: #a7f3d0; font-weight: bold;">Budget Bracket:</td>
        <td style="padding: 10px; color: #ffffff;">${escapeHtml(leadData.budget)}</td>
      </tr>
    </table>

    <div style="margin-top: 20px; padding: 15px; background-color: #004157; border-radius: 6px;">
      <h3 style="margin-top: 0; color: #34d399; font-size: 14px;">Project Details / Message:</h3>
      <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.5; color: #f1f5f9;">${escapeHtml(leadData.message)}</p>
    </div>

    <p style="font-size: 12px; color: #64748b; margin-top: 24px;">Submitted on ${new Date().toLocaleString()}</p>
  </div>
`;

    await mail.transporter.sendMail({ from: `"AriseStudio Website" <${mail.sender}>`, to: mail.recipient, replyTo: leadData.email,
      subject: `[Lead] ${leadData.name.replace(/[\r\n]/g, " ")} - ${leadData.service.replace(/[\r\n]/g, " ")} (${leadData.company.replace(/[\r\n]/g, " ")})`,
      html: htmlContent, text: `New AriseStudio inquiry\nName: ${leadData.name}\nEmail: ${leadData.email}\nCompany: ${leadData.company}\n${leadData.message}`,
      messageId: `<lead.${id}@arisestudio.com>` });
    await db.execute({ sql: "UPDATE contact_notification_delivery SET sentAt = ? WHERE leadId = ?", args: [new Date().toISOString(), id] });
    return true;
  } catch {
    console.warn("[Contact Notification]: Saved inquiry queued for retry.");
    await db.execute({ sql: "UPDATE contact_notification_delivery SET claimUntil = ? WHERE leadId = ? AND sentAt IS NULL", args: [Date.now() + 60000, id] });
    return false;
  }
}

// shortcut: retries follow contact/scheduler activity; use a scheduled worker for guaranteed retries without traffic.
export async function sendPendingContactNotifications(): Promise<void> {
  try {
    if (!mailTransport()) return;
    const db = await getDatabase();
    const pending = await db.execute({ sql: "SELECT leadId FROM contact_notification_delivery WHERE sentAt IS NULL AND claimUntil <= ? LIMIT 2", args: [Date.now()] });
    for (const row of pending.rows) await sendContactNotification(Number(row.leadId));
  } catch { console.warn("[Contact Notification]: Queue unavailable."); }
}
