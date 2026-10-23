import { NextResponse, after } from "next/server";
import { getDatabase } from "@/lib/turso";
import { limitSubmission, readSubmission, SubmissionError } from "@/lib/submissions";
import { sendContactNotification, sendPendingContactNotifications } from "@/lib/contactNotification";

export async function POST(req: Request) {
  try {
    await limitSubmission(req, "contact");
    const { name, email, phone, company, service, budget, message } = await readSubmission(req, {
      name: { min: 1, max: 120 }, email: { min: 1, max: 254 }, phone: { max: 64 },
      company: { max: 300 }, service: { max: 100 }, budget: { max: 100 }, message: { min: 5, max: 5000 },
    });
    await limitSubmission(req, "contact", email);
    const leadData = { name, email, phone: phone || "Not provided", company: company || "Not provided",
      service: service || "General Inquiry", budget: budget || "Not specified", message, submittedAt: new Date().toISOString() };
    const database = await getDatabase();
    const result = await database.batch([
      { sql: "INSERT INTO contact_leads (submission) VALUES (?) RETURNING id", args: [JSON.stringify(leadData)] },
      "INSERT INTO contact_notification_delivery (leadId) VALUES (last_insert_rowid())",
    ], "write");
    after(sendPendingContactNotifications);
    let emailSent = false;
    try { emailSent = await sendContactNotification(Number(result[0].rows[0].id)); }
    catch { console.warn("[Contact Notification]: Saved inquiry awaits notification."); }
    return NextResponse.json({ success: true, message: "Consultation request recorded successfully.", emailSent,
      emailNotice: emailSent ? undefined : "Your request is saved, but we could not notify our team yet. For urgent help, please contact us directly.",
      lead: { name, company: leadData.company, service: leadData.service } });
  } catch (error) {
    if (error instanceof SubmissionError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    console.error("[Contact API]: Could not save inquiry.");
    return NextResponse.json({ success: false, error: "We could not save your request. Please try again or email us directly." }, { status: 503 });
  }
}
