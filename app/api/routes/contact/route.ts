import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    // The frontend sends: name, email, phone, subject, message
    // See: app/(main)/contact/page.tsx
    const data = await req.formData();
    const name = data.get("name")?.toString().trim() || "";
    const email = data.get("email")?.toString().trim() || "";
    const phone = data.get("phone")?.toString().trim() || "";
    const subject = data.get("subject")?.toString().trim() || "";
    const message = data.get("message")?.toString().trim() || "";

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Compose admin email
    const adminTo = process.env.CONTACT_RECEIVER || process.env.SMTP_USER;
    const adminSubject = `New Contact Form Submission: ${subject}`;
    const adminText = `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Subject: ${subject}
      Message: ${message}
    `;
    const adminHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    // Compose user confirmation email
    const userTo = email;
    const userSubject = "Thank you for contacting PT International!";
    const userText = `Dear ${name},\n\nThank you for reaching out to PT International. We have received your message and will get back to you soon.\n\nYour message:\n${message}\n\nBest regards,\nPT International Team`;
    const userHtml = `<p>Dear ${name},</p><p>Thank you for reaching out to PT International. We have received your message and will get back to you soon.</p><p><strong>Your message:</strong><br/>${message}</p><p>Best regards,<br/>PT International Team</p>`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
      },
    });

    // Send to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: adminTo,
      subject: adminSubject,
      text: adminText,
      html: adminHtml,
    });

    // Send confirmation to user
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: userTo,
      subject: userSubject,
      text: userText,
      html: userHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
