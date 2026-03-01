import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined
});

export const sendTicketEmail = async ({ to, ticketId, qrCodeDataUrl, passName, phaseName }) => {
  if (!to) return;
  const html = `<h2>Your Ticket is Confirmed</h2><p>Ticket ID: <b>${ticketId}</b></p><p>${passName} - ${phaseName}</p><img src="${qrCodeDataUrl}" alt="QR"/>`;
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'nightshift@example.com',
    to,
    subject: 'Shama & Soul Ticket Confirmation',
    html
  });
};
